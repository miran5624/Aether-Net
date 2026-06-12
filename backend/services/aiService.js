// ============================================================
// AetherNet AI Service — Gemini AI Powered
// Fixed: removed non-existent gemini-3.5-flash model,
//        429 (quota) is per-model — falls through to next model,
//        only 401/403 (bad API key) short-circuit globally,
//        improved logging and fallback chain.
// ============================================================

const { GoogleGenAI } = require('@google/genai');
const { getEmergencyLocation } = require('../utils/geocoding');

// Initialize the SDK using process.env.GEMINI_API_KEY automatically
const ai = new GoogleGenAI({});

// ─── MARKDOWN STRIPPER ────────────────────────────────────────
/**
 * Remove markdown formatting from AI-generated text
 * Strips: **bold**, *italic*, __underline__, `code`, etc.
 * Preserves the actual text content
 */
function stripMarkdown(text) {
    if (!text) return text;
    
    return text
        // Remove bold: **text** or __text__
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        // Remove italic: *text* or _text_
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        // Remove inline code: `text`
        .replace(/`(.+?)`/g, '$1')
        // Remove headers: ## text or ### text
        .replace(/^#{1,6}\s+/gm, '')
        // Remove bullet points: - text or * text
        .replace(/^[-*]\s+/gm, '')
        // Remove numbered lists: 1. text
        .replace(/^\d+\.\s+/gm, '')
        // Clean up any remaining asterisks or underscores
        .replace(/\*+/g, '')
        .replace(/_+/g, '')
        // Clean up extra whitespace
        .replace(/\s+/g, ' ')
        .trim();
}

// ─── GEMINI API CORE HELPER ──────────────────────────────────
async function callGemini(prompt) {
    // Valid model chain — gemini-3.5-flash does NOT exist, removed to avoid
    // wasting a round-trip 503 on every single call.
    const models = [
        'gemini-2.5-flash',   // Primary — fastest, most capable
        'gemini-2.0-flash',   // Fallback — stable
        'gemini-1.5-flash',   // Last resort — always available
    ];

    for (const modelName of models) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    temperature: 0.3,
                    maxOutputTokens: 1024, // Increased from 512 to prevent truncation
                },
            });

            const text = response.text;
            if (text && text.trim().length > 0) {
                // Strip markdown formatting from AI response
                const cleanText = stripMarkdown(text.trim());
                console.log(`[aiService] ✅ Gemini response generated using model: ${modelName}`);
                return cleanText;
            }

            // Empty response — try next model
            console.warn(`[aiService] ⚠️ ${modelName} returned empty response, trying next...`);

        } catch (err) {
            const rawMessage = err.message || JSON.stringify(err);

            // Attempt to parse the nested JSON error Gemini SDK wraps errors in
            let code = null;
            try {
                const parsed = JSON.parse(rawMessage);
                code = parsed?.error?.code;
            } catch {
                // Not JSON — leave code as null
            }

            // ── Truly global errors: same API key is used for all models,
            //    so these will fail identically on every model. Short-circuit immediately.
            if (code === 400) {
                console.error(`[aiService] ❌ Bad request (400) — check prompt format: ${rawMessage}`);
                throw new Error(`Gemini bad request: ${rawMessage}`);
            }
            if (code === 401 || code === 403) {
                console.error(`[aiService] ❌ Auth/permission error (${code}) — check GEMINI_API_KEY: ${rawMessage}`);
                throw new Error(`Gemini auth error ${code}: ${rawMessage}`);
            }

            // ── Per-model errors: 429 quota and 503 overload are scoped to a specific
            //    model. Each model has its own separate free-tier quota bucket, so
            //    falling through to the next model is exactly the right move.
            if (code === 429) {
                console.warn(`[aiService] ⚠️ ${modelName} quota exhausted (429), trying next model...`);
            } else if (code === 503) {
                console.warn(`[aiService] ⚠️ ${modelName} overloaded (503), trying next model...`);
            } else {
                console.warn(`[aiService] ⚠️ ${modelName} failed (code: ${code ?? 'unknown'}), trying next model. Reason: ${rawMessage}`);
            }
        }
    }

    // All models exhausted
    throw new Error('All Gemini models failed. Unable to generate AI response. Please contact emergency services immediately at 112.');
}

// ─── 1. DYNAMIC FIRST-RESPONSE GUIDANCE ──────────────────────
const generateFirstResponseGuidance = async (sosType, modalData, userProfile) => {
    const description = modalData?.description || '';
    const bloodGroup = userProfile?.blood_group || '';
    const healthConditions = userProfile?.health_conditions || '';

    const prompt = `You are an expert emergency assistant operating in India.
The system context is classified as a "${sosType}" alert.

User-Provided Crisis Context:
- Description of the situation: "${description}"
- Medical history/conditions: ${healthConditions || 'None registered'}
- Blood group: ${bloodGroup || 'Not specified'}

Task:
Analyze the specific situation details. If the description mentions a low-severity issue (like a simple headache), provide calm relief tips. If the description indicates a high-severity crisis (like a heart attack, deep wound, or cardiac distress), immediately list life-saving emergency actions. Provide relevant emergency dispatch numbers (like 108 for medical or 112) depending on what the severity demands.`;

    try {
        return await callGemini(prompt);
    } catch (err) {
        console.error('[aiService] ❌ CRITICAL: Unable to generate first-response guidance:', err.message);
        throw new Error(`AI service unavailable: ${err.message}. Please contact emergency services immediately at 112.`);
    }
};

// ─── 2. DYNAMIC EMERGENCY CALL SCRIPT ────────────────────────
const generateCallScript = async (sosType, modalData, userProfile, locationHint = '', lat = null, lng = null) => {
    const name = userProfile?.name || 'an individual';
    const description = modalData?.description || '';
    const bloodGroup = userProfile?.blood_group || '';
    const healthConditions = userProfile?.health_conditions || '';

    // Get human-readable address from GPS coordinates
    let locationInfo = locationHint || 'Current location';
    
    if (lat && lng) {
        try {
            console.log(`[aiService] 🗺️ Reverse geocoding: ${lat}, ${lng}`);
            const address = await getEmergencyLocation(lat, lng, locationHint);
            locationInfo = address;
            console.log(`[aiService] ✅ Location resolved: ${address}`);
        } catch (error) {
            console.error('[aiService] ⚠️ Geocoding failed, using coordinates:', error.message);
            locationInfo = locationHint 
                ? `${locationHint} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`
                : `GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    }

    let contextDetails = '';
    
    // Add type-specific context
    if (sosType === 'Medical') {
        contextDetails = `Blood Group: ${bloodGroup || 'Unknown'}\nHealth Conditions: ${healthConditions || 'None reported'}\nLocation: ${locationInfo}`;
    } else if (sosType === 'Car Problem') {
        const make = modalData?.make || '';
        const model = modalData?.model || '';
        const plate = modalData?.plate || '';
        contextDetails = `Vehicle: ${make} ${model}\nPlate Number: ${plate}\nLocation: ${locationInfo}`;
    } else if (sosType === 'Fire' || sosType === 'Gas Leak') {
        contextDetails = `Location: ${locationInfo}`;
    } else {
        contextDetails = `Location: ${locationInfo}`;
    }

    const prompt = `You are helping prepare an emergency call script for calling 112 in India.

CALLER DETAILS:
Name: ${name}
Emergency Type: ${sosType}
Situation: ${description || 'Emergency situation'}

CONTEXT:
${contextDetails}

TASK: Write the EXACT words the caller should speak to the 112 emergency dispatcher. Requirements:

1. Write in FIRST PERSON (as if you ARE the caller speaking)
2. Start with: "Hello, this is ${name}."
3. Clearly state the emergency type
4. Describe the specific situation
5. State the COMPLETE location address (CRITICAL - say the full address exactly as provided above)
6. Mention medical details if relevant (blood group, conditions)
7. Request immediate assistance
8. Mention that a NearHelp community alert has been triggered
9. End with urgency if life-threatening

DO NOT include:
- Any preamble like "Here's a script..." or "This is what to say..."
- Stage directions like "*pauses*" or "[location]"
- Your own commentary
- Incomplete sentences

Write a complete, professional emergency call script (4-6 sentences). Start now with "Hello, this is ${name}..."`;

    try {
        return await callGemini(prompt);
    } catch (err) {
        console.error('[aiService] ❌ Unable to generate call script:', err.message);
        throw new Error(`AI service unavailable: ${err.message}`);
    }
};

// ─── 3. POST-RESOLUTION DEBRIEF ──────────────────────────────
const generateDebriefPrompt = async (sos) => {
    const durationMin = sos.resolved_at
        ? Math.round((new Date(sos.resolved_at) - new Date(sos.created_at)) / 60000)
        : null;

    const prompt = `Act as a supportive coordinator. An emergency situation of type "${sos.type}" with the details "${sos.modal_data?.description || 'medical distress'}" has just been successfully resolved after lasting ${durationMin || 'a few'} minutes.

Generate a short, thoughtful decompression message checking in on their well-being based on what they just went through.`;

    try {
        return await callGemini(prompt);
    } catch (err) {
        console.error('[aiService] ❌ Unable to generate debrief:', err.message);
        throw new Error(`AI service unavailable: ${err.message}`);
    }
};

// ─── 4. INCIDENT SUMMARY ─────────────────────────────────────
const generateResolutionSummary = async (sos) => {
    const duration = sos.response_time_seconds
        ? `${Math.floor(sos.response_time_seconds / 60)}m ${sos.response_time_seconds % 60}s`
        : 'Variable';

    const prompt = `Generate a concise summary log entry for this incident:
- Incident Type: ${sos.type}
- Total Active Duration: ${duration}
- Responders deployed: ${sos.responders?.length || 0}
- Log description: "${sos.modal_data?.description || 'No user input metadata available'}"`;

    try {
        return await callGemini(prompt);
    } catch (err) {
        console.error('[aiService] ❌ Unable to generate resolution summary:', err.message);
        throw new Error(`AI service unavailable: ${err.message}`);
    }
};

module.exports = {
    generateFirstResponseGuidance,
    generateCallScript,
    generateDebriefPrompt,
    generateResolutionSummary,
};