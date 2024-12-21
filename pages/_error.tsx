/* eslint-disable @next/next/no-page-custom-font */
import React, { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import NextErrorComponent, { ErrorProps } from 'next/error';
import { NextPage } from 'next/types';
import { useRouter } from 'next/router';

const ErrorPage: NextPage<ErrorProps> = (props) => {
  const router = useRouter();
  useEffect(() => {
    if (props.statusCode === 401 || props.statusCode === 403) {
      const loginUrl = {
        pathname: process.env.LOGIN_URL,
        search: `?source=${window.location.origin}`,
      };
      router.push(`${loginUrl.pathname}${loginUrl.search}`);
    }
  }, [props.statusCode, router]);

  return <NextErrorComponent statusCode={props.statusCode} />;
};

ErrorPage.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return NextErrorComponent.getInitialProps(contextData as any);
};

export default ErrorPage;