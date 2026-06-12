// ============================================================
// Geocoding Utility - Convert GPS coordinates to readable address
// ============================================================

const axios = require('axios');

/**
 * Reverse geocode: convert lat/lng to human-readable address
 * Uses OpenStreetMap Nominatim (free, no API key required)
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Formatted address or fallback message
 */
async function reverseGeocode(lat, lng) {
    if (!lat || !lng) {
        return 'Location unavailable';
    }

    try {
        // Using OpenStreetMap Nominatim - free, no API key needed
        // Respectful usage with user-agent header
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat: lat,
                lon: lng,
                format: 'json',
                addressdetails: 1,
                zoom: 18, // Most detailed level
            },
            headers: {
                'User-Agent': 'AetherNet-Emergency-App/1.0'
            },
            timeout: 5000 // 5 second timeout
        });

        if (response.data && response.data.display_name) {
            // Get the display name (full address)
            const fullAddress = response.data.display_name;
            
            // Try to extract more structured info if available
            const addr = response.data.address || {};
            
            // Build a concise but informative address
            let parts = [];
            
            // Street-level info
            if (addr.road) parts.push(addr.road);
            if (addr.house_number) parts.unshift(addr.house_number);
            
            // Locality
            if (addr.neighbourhood) parts.push(addr.neighbourhood);
            else if (addr.suburb) parts.push(addr.suburb);
            
            // City/town
            if (addr.city) parts.push(addr.city);
            else if (addr.town) parts.push(addr.town);
            else if (addr.village) parts.push(addr.village);
            
            // State
            if (addr.state) parts.push(addr.state);
            
            // Postal code
            if (addr.postcode) parts.push(addr.postcode);
            
            // If we got structured data, use it; otherwise use full address
            const structuredAddress = parts.length > 0 ? parts.join(', ') : fullAddress;
            
            console.log(`[Geocoding] ✅ Resolved: ${structuredAddress}`);
            return structuredAddress;
        }

        // Fallback to coordinates if no address found
        console.warn(`[Geocoding] ⚠️ No address found, using coordinates`);
        return `GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    } catch (error) {
        console.error('[Geocoding] ❌ Error:', error.message);
        
        // Fallback to raw coordinates on error
        return `GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
}

/**
 * Get a short location description suitable for emergency calls
 * Prioritizes most relevant info for emergency responders
 */
async function getEmergencyLocation(lat, lng, landmark = '') {
    try {
        const address = await reverseGeocode(lat, lng);
        
        // If we have a landmark, include it
        if (landmark && landmark.trim().length > 0) {
            return `${landmark}, ${address}`;
        }
        
        return address;
    } catch (error) {
        console.error('[Geocoding] ❌ Emergency location error:', error.message);
        
        // Ultimate fallback
        if (landmark) {
            return `${landmark} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`;
        }
        return `GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
}

module.exports = {
    reverseGeocode,
    getEmergencyLocation,
};
