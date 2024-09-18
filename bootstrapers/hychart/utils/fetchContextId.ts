import { Config, showcaseClient, showcaseContext } from "@bcrumbs.net/bc-api";

/**
 * Fetches the context ID for a given domain.
 *
 * @param targetDomain - The domain for which to fetch the context ID.
 * @returns A promise that resolves to the context ID or undefined if not found.
 */
export async function fetchContextId(targetDomain: string) {
  const contextResponse = await showcaseClient.query({
    query: showcaseContext,
    variables: { domain: targetDomain }, // Pass the domain directly
  });

  if (!contextResponse.data || !contextResponse.data.contextId) {
    return undefined; // Return undefined if no data found
  }

  return contextResponse.data.contextId; // Return the context ID
}
