/**
 * Google Maps Embed Scraper
 * 
 * Converts Google Maps URLs (short or long) into embeddable iframe URLs.
 * 
 * @module google-maps-embed-scraper
 */

/**
 * Result object containing the embed URL and extracted details.
 * @typedef {Object} EmbedResult
 * @property {string} original - The original input URL.
 * @property {string} [expanded] - The resolved long URL (if input was a short link).
 * @property {string} [embed] - The generated iframe source URL.
 * @property {Object} [details] - Extracted location details.
 * @property {string} [details.placeName] - The name of the place.
 * @property {string} [details.lat] - Latitude.
 * @property {string} [details.lng] - Longitude.
 * @property {string} [error] - Error message if parsing failed.
 */

/**
 * Converts a Google Maps URL to an embed URL.
 * 
 * @param {string} url - The Google Maps URL (e.g., https://maps.app.goo.gl/... or https://google.com/maps/place/...)
 * @returns {Promise<EmbedResult>} The result object.
 */
async function getEmbedUrl(url) {
    if (!url || typeof url !== 'string') {
        return { error: "Invalid URL provided." };
    }

    try {
        let longUrl = url;

        // check if it's a short URL (goo.gl, maps.app.goo.gl, or generic bit.ly that might redirect to maps)
        // We broadly check if it DOESN'T look like a long google maps url to decide if we fetch headers.
        const isLongUrl = url.includes("google.com/maps") || url.includes("google.co.in/maps");

        if (!isLongUrl) {
            try {
                const response = await fetch(url, { redirect: 'follow', method: 'GET' });
                longUrl = response.url;
            } catch (err) {
                // return partial info if fetch fails, but usually this is fatal for short urls
                return { original: url, error: `Failed to resolve short URL: ${err.message}` };
            }
        }

        if (!longUrl) {
            return { original: url, error: "Empty resolved URL." };
        }

        // Regex patterns
        // 1. Standard: /place/PLACE_NAME/@LAT,LNG,ZOOM
        const standardRegex = /\/maps\/place\/([^/]+)\/@(-?\d+\.\d+),(-?\d+\.\d+)/;

        let match = longUrl.match(standardRegex);

        if (match) {
            const placeName = match[1];
            const lat = match[2];
            const lng = match[3];

            // Clean up place name (replace + with space, decode)
            const cleanPlaceName = decodeURIComponent(placeName.replace(/\+/g, ' '));

            // Re-encode for the embed URL to ensure validity
            const encodedPlaceName = encodeURIComponent(cleanPlaceName);

            const embedUrl = `https://maps.google.com/maps?q=${encodedPlaceName}&ll=${lat},${lng}&z=14&output=embed`;

            return {
                original: url,
                expanded: longUrl !== url ? longUrl : undefined,
                embed: embedUrl,
                details: {
                    placeName: cleanPlaceName,
                    lat,
                    lng
                }
            };
        }

        // Handle side-panel URLs or other formats if needed in future (e.g. ?q=lat,lng)
        // For now, if standard regex fails:

        return {
            original: url,
            expanded: longUrl !== url ? longUrl : undefined,
            error: "Could not parse location details from URL."
        };

    } catch (error) {
        return { original: url, error: error.message };
    }
}

module.exports = { getEmbedUrl };
