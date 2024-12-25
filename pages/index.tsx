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
import { fetchTranslations } from '../bootstrapers/hychart/utils/fetchTranslations';
import { ThemeProvider } from '../components/common/context/themeContext';

export async function getServerSideProps({ req, query }) {
  query.host = 'islamic-scholars.hy';
  // Fetching configuration
  const domain = query.host || req.headers['host'];
  const targetDomain = checkIfKnownDomain(domain);
  const path = query.path;

  let config = undefined;
  let contents = undefined;
  let contextId = undefined;
  let translations = undefined;
  let newPath = path || null;
  try {
    // Getting needed data
    config = await fetchWebsiteConfig(targetDomain);
    if (!path) {
      newPath = `/${config.mainChart}`;
    }
    contextId = await fetchContextId(targetDomain);
    translations = await fetchTranslations(config.lang);
    contents = await fetchWebsiteContents(config, newPath);

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
      translations
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
  translations,
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
  translations: Record<string, string | Record<string, string>> | null;
}) => {
  if (invalid) {
    return <Error statusCode={400} />;
  }

  if (data[0] == null) {
    return <Error statusCode={404} />;
  }

  // Call the useTokenChecker hook here
  useTokenChecker();
  return (
    <ThemeProvider rootContent={data[0]} lang={config.lang} translations={translations}>
      <Chart config={config} contextId={contextId} data={data} />
    </ThemeProvider>
  );
};

export default TemplateRouter;
