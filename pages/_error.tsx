/* eslint-disable @next/next/no-page-custom-font */
import React from 'react';
import * as Sentry from '@sentry/nextjs';
import NextErrorComponent, { ErrorProps } from 'next/error';
import { NextPage } from 'next/types';

const ErrorPage: NextPage<ErrorProps> = (props) => {
  return <NextErrorComponent statusCode={props.statusCode} />;
};

ErrorPage.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return NextErrorComponent.getInitialProps(contextData as any);
};

export default ErrorPage;
