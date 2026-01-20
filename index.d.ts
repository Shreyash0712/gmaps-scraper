/**
 * Result object containing the embed URL and extracted details.
 */
export interface EmbedResult {
    /** The original input URL. */
    original: string;
    /** The resolved long URL (if input was a short link). */
    expanded?: string;
    /** The generated iframe source URL. */
    embed?: string;
    /** Extracted location details. */
    details?: {
        /** The name of the place. */
        placeName?: string;
        /** Latitude. */
        lat?: string;
        /** Longitude. */
        lng?: string;
    };
    /** Error message if parsing failed. */
    error?: string;
}

/**
 * Converts a Google Maps URL to an embed URL.
 * 
 * @param url - The Google Maps URL (e.g., https://maps.app.goo.gl/... or https://google.com/maps/place/...)
 * @returns Promise resolving to the result object.
 */
export function getEmbedUrl(url: string): Promise<EmbedResult>;
