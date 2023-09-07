import { GraphContent, Config } from '@bcrumbs.net/bc-api';
import {
  checkIfKnownDomain,
  logWebsiteVisit,
  fetchWebsiteConfig,
  fetchWebsiteContents,
} from '../bootstrapers/hychart/utils';
import Chart from '../components/chart';

export async function getServerSideProps({ req, query }) {
  // Fetching configuration
  const domain = req.headers['host'];
  const targetDomain = checkIfKnownDomain(domain);
  const path = query.path;
  // Logging the visit
  logWebsiteVisit(domain);
  // Getting needed data
  const config = await fetchWebsiteConfig(targetDomain);
  const contents = await fetchWebsiteContents(config, path);

  return {
    props: {
      config,
      data: contents,
    },
  };
}

export const TemplateRouter = ({
  config,
  data,
  query,
}: {
  config: Config;
  query: {
    path: string;
    path2: string;
  };
  data: GraphContent[];
}) => {
  return <Chart config={config} data={data} />;
};

export default TemplateRouter;
