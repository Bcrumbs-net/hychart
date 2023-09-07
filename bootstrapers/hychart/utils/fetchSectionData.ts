import {
  GraphContent,
  showcaseClient,
  showcaseSectionQuery,
} from '@bcrumbs.net/bc-api';

/**
 *
 * @param id
 * @param templateId
 *
 */
export async function fetchSectionData(
  id: number,
  companyId: number
): Promise<GraphContent | null> {
  const dataResponse = await showcaseClient.query({
    query: showcaseSectionQuery,
    variables: {
      id,
      companyId,
    },
  });

  if (dataResponse && dataResponse.data) {
    return dataResponse.data.pageResoruce;
  }

  return null;
}
