import { withApollo } from 'next-with-apollo';
import { showcaseClient } from "@bcrumbs.net/bc-api";

// Export a HOC from next-with-apollo
// Docs: https://www.npmjs.com/package/next-with-apollo
export const withShowcaseClient = withApollo(
  ({ initialState }) =>
    // @ts-expect-error will be fixed later
    showcaseClient
);
