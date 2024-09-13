// import { Config, showcaseClient, contextId } from "@bcrumbs.net/bc-api";

// /**
//  *
//  * @param targetDomain
//  *
//  */
// export async function fetchWebsiteConfig(targetDomain: string) {
//   const configResponse = await showcaseClient.query({
//     query: contextId,
//     variables: { domain: ";" },
//   });

//   if (!configResponse.data) {
//     return;
//   }

//   return JSON.parse(configResponse.data.configuration) as Config;
// }
