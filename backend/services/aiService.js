// ============================================================
// NearHelp AI Service — keyword engine powered (zero API calls)
// All functions retain async signatures so no callers need changes
// ============================================================

const { getGuidanceBySOSType } = require('./keywordEngine');

// ─── 1. FIRST-RESPONSE GUIDANCE ──────────────────────────────
const generateFirstResponseGuidance = async (sosType, modalData, userProfile) => {
    const response = getGuidanceBySOSType(sosType);
    let guidance = response.guidance;

    // Append blood group note if medical and we have it
    if (sosType === 'Medical' && userProfile?.blood_group) {
        guidance += `\n8. Blood group on record: ${userProfile.blood_group} — inform medical responder immediately`;
    }

    return guidance;
};

// ─── 2. EMERGENCY CALL SCRIPT ────────────────────────────────
const generateCallScript = async (sosType, modalData, userProfile, locationHint = '') => {
    const name = userProfile?.name || 'a NearHelp user';
    const location = locationHint || '[DESCRIBE YOUR LOCATION]';

    const scriptMap = {
        'Medical': `I am reporting a medical emergency. My name is ${name}. The person is at ${location}. They are ${modalData?.description || 'injured and needs immediate help'}. ${userProfile?.blood_group ? 'Blood group: ' + userProfile.blood_group + '.' : ''} Please send an ambulance immediately.`,
        'Fire': `I am reporting a fire emergency. My name is ${name}. The fire is at ${location}. People may be inside. Please send the fire brigade immediately.`,
        'Gas Leak': `I am reporting a gas leak. My name is ${name}. The location is ${location}. We have evacuated the building. Please send emergency services immediately.`,
        'Car Problem': `I am stranded due to a vehicle breakdown. My name is ${name}. I am at ${location}. ${modalData?.make ? 'Vehicle: ' + modalData.make + ' ' + (modalData.model || '') + '.' : ''} I need roadside assistance.`,
        'Flood / Water': `I am reporting a flooding emergency. My name is ${name}. I am trapped at ${location}. Water levels are rising. Please send rescue services immediately.`,
        'Threat to Safety': `I need police assistance immediately. My name is ${name}. I am at ${location}. I am in danger. Please send officers now.`,
    };

    return scriptMap[sosType] || `I am calling to report a ${sosType} emergency. My name is ${name}. I am at ${location}. Please send help immediately.`;
};

// ─── 3. POST-RESOLUTION DEBRIEF ──────────────────────────────
const generateDebriefPrompt = async (sos) => {
    const durationMin = sos.resolved_at
        ? Math.round((new Date(sos.resolved_at) - new Date(sos.created_at)) / 60000)
        : null;

    return `You handled something really difficult today${durationMin ? ` (${durationMin} minutes)` : ''}. Take a moment to rest and drink some water. Let someone close to you know you are safe. You do not have to process everything at once — it is okay to take your time.`;
};

// ─── 4. INCIDENT SUMMARY ─────────────────────────────────────
const generateResolutionSummary = async (sos) => {
    const duration = sos.response_time_seconds
        ? `${Math.floor(sos.response_time_seconds / 60)}m ${sos.response_time_seconds % 60}s`
        : 'Unknown';

    return `Incident Type: ${sos.type} | ` +
        `Time: ${new Date(sos.created_at).toLocaleString()} | ` +
        `Duration: ${duration} | ` +
        `Responders: ${sos.responders?.length || 0} | ` +
        `Status: Resolved successfully by community response`;
};

module.exports = {
    generateFirstResponseGuidance,
    generateCallScript,
    generateDebriefPrompt,
    generateResolutionSummary,
};
