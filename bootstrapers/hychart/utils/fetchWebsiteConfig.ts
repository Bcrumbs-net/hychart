import { Config, showcaseClient, showcaseConfig } from "@bcrumbs.net/bc-api";

/**
 *
 * @param targetDomain
 *
 */
export async function fetchWebsiteConfig(targetDomain: string) {
  const configResponse = await showcaseClient.query({
    query: showcaseConfig,
    variables: { domain: ';' + targetDomain + ';' },
  });
  
  return JSON.parse(configResponse.data.configuration) as Config;
}
