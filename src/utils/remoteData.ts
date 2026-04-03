/**
 * Generic utility to fetch JSON from a remote URL with a timeout and fallback.
 * @param url The remote JSON URL.
 * @param fallback The local data to return if the fetch fails or times out.
 * @param timeoutMs Timeout in milliseconds (default 3000ms).
 */
export async function fetchRemoteConfig<T>(
  url: string,
  fallback: T,
  timeoutMs: number = 3000
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`Fetching remote config from: ${url}`);
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-cache', // Ensure we get the latest live version
    });

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    clearTimeout(id);
    console.warn(`Failed to fetch remote config from ${url}. Using local fallback.`, error);
    return fallback;
  }
}
