import { dconfigClient, registeUsage } from "@bcrumbs.net/bc-api";

/**
 *
 * @param targetDomain
 *
 */
export async function logWebsiteVisit(targetDomain: string) {
  if (
    !targetDomain ||
    targetDomain.indexOf('localhost') >= 0 ||
    targetDomain.indexOf('bc-showcase') >= 0 ||
    targetDomain.indexOf('test.bcrumbs.net') >= 0 ||
    targetDomain.indexOf('test-showcase.bcrumbs.net') >= 0
  ) {
    return;
  }

  await dconfigClient.mutate({
    mutation: registeUsage,
    variables: { body: { domain: targetDomain } },
  });
}
