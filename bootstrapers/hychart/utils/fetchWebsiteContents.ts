import {
  Config,
  showcaseClient,
  showcaseContentsQuery,
} from '@bcrumbs.net/bc-api';

/**
 *
 * @param targetDomain
 *
 */
export async function fetchWebsiteContents(config: Config, path: string) {
  const dataResponse = await showcaseClient.query({
    query: showcaseContentsQuery,
    variables: {
      rootId: config.root,
      deep: config.deep || 3,
      path,
    },
    fetchPolicy: 'no-cache'
  });

  if (dataResponse && dataResponse.data) {
    return dataResponse.data.contents;
  }

  return null;
}
