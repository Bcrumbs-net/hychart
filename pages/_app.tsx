import React from 'react';
import { AppProps } from 'next/app';
import { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { withShowcaseClient } from '../bootstrapers/hychart/clients/showcase';
import '../public/assets/css/flaticon.css';
// import 'bootstrap-4-grid/css/grid.min.css';
import '../public/assets/css/styles.scss';

function Hychart({
  Component,
  pageProps,
  apollo,
}: AppProps & { apollo: ApolloClient<any> }) {
  const AnyComponent = Component as any;

  return (
    <ApolloProvider client={apollo}>
      <>
        {/* <Modal /> */}
        <AnyComponent {...pageProps}/>
      </>
    </ApolloProvider>
  );
}

Hychart.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};
  return { pageProps };
};

// @ts-ignore TypeScript is complaining
export default withShowcaseClient(Hychart);
