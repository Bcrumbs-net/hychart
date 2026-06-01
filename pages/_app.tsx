import React from 'react';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { showcaseClient } from '../bootstrapers/hychart/clients/showcase';
import '../public/assets/css/flaticon.css';
import '../public/assets/css/styles.scss';

function Hychart({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;

  return (
    <ApolloProvider client={showcaseClient}>
      <AnyComponent {...pageProps} />
    </ApolloProvider>
  );
}

export default Hychart;
