import { GraphContent, Config } from '@bcrumbs.net/bc-api';
import {
  checkIfKnownDomain,
  logWebsiteVisit,
  fetchWebsiteConfig,
  fetchWebsiteContents,
  useTokenChecker,
  fetchContextId
} from '../bootstrapers/hychart/utils';
import Chart from '../components/chart';
import Error from './_error';

export async function getServerSideProps({ req, query }) {
  query.host = 'islamic-scholars.hy';
  // Fetching configuration
  const domain = query.host || req.headers['host'];
  const targetDomain = checkIfKnownDomain(domain);
  const path = query.path;

  let config = undefined;
  let contents = undefined;
  let contextId = undefined;
  try {
    // Getting needed data
    config = await fetchWebsiteConfig(targetDomain);
    contextId = await fetchContextId(targetDomain);
    contents = await fetchWebsiteContents(config, path);
    // Logging the visit
    logWebsiteVisit(domain);
  } catch (ex) {
    return {
      props: {
        invalid: true,
        errorCode: ex.statusCode || null,
        error: ex.message || null,
      },
    };
  }
  if (!config) {
    return {
      props: {
        invalid: true,
      },
    };
  }

  return {
    props: {
      config,
      contextId,
      data: contents,
    },
  };
}
export const TemplateRouter = ({
  config,
  contextId,
  data,
  query,
  errorCode,
  error,
  invalid,
}: {
  errorCode?: number;
  error?: string;
  config?: Config;
  contextId: string;
  query?: {
    path: string;
    path2: string;
  };
  data?: GraphContent[];
  invalid?: boolean;
}) => {
  if (invalid) {
    return <Error statusCode={400} />;
  }

  // Call the useTokenChecker hook here
  useTokenChecker();

  return <Chart config={config} contextId={contextId} data={data} />;
};

export default TemplateRouter;
