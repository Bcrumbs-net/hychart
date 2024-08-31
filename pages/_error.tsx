/* eslint-disable @next/next/no-page-custom-font */
import React from 'react';
import Head from 'next/head';
import ErrorSec from '../components/error';
import { ResetCSS } from '../public/assets/css/style';
import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
class ErrorPage extends React.Component<{ statusCode?: string }> {
  static async getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    return (
      <>
        <Head>
          <title>404: Not found</title>
          {/* Load google fonts */}
          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,700|Poppins:400,500,600,700|Roboto:400,500,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        {/*@ts-ignore: Unreachable code error */}
        <ResetCSS />
        <div>
          <ErrorSec></ErrorSec>
        </div>
      </>
    );
  }
}

ErrorPage.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  // ...other getInitialProps code

  return Error.getInitialProps(contextData as any);
};

export default ErrorPage;
