// Central API base URL — reads from env var in production, falls back to localhost in dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Fetch with automatic retry — handles Render free tier cold starts (~50s wake).
 * Retries up to `retries` times with increasing delay between attempts.
 */
export async function fetchWithRetry(
    url: string,
    options?: RequestInit,
    retries = 3,
    delayMs = 2000
): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(i === 0 ? 15000 : 60000), // 15s first try, 60s retries
            });
            return res;
        } catch (err) {
            if (i === retries - 1) throw err;
            console.log(`[fetchWithRetry] Attempt ${i + 1} failed, retrying in ${delayMs}ms...`);
            await new Promise(r => setTimeout(r, delayMs));
            delayMs *= 1.5;
        }
    }
    throw new Error('All retry attempts failed');
}

export default API_BASE;
