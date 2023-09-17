/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable react/display-name */
import { Fragment, ReactElement } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

//@ts-ignore
export default class CustomDocument extends Document<{
  styleTags: ReactElement[];
}> {
  static getInitialProps({ renderPage, req }) {
    const sheet = new ServerStyleSheet();
    const domain = req.headers['host'];
    const page = renderPage(
      (App) => (props) => sheet.collectStyles(<App {...props} />)
    );

    const styleTags = sheet.getStyleElement();

    return { ...page, styleTags, domain };
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NRPT8DK');	`,
            }}
          />
          <link
            rel="stylesheet"
            href="https://cdn.bcrumbs.net/bc-assets/styles/constants.css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:100,300,500,700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdn.bcrumbs.net/bc-assets/styles/index.css"
          />
          <link
            rel="stylesheet"
            href="https://cdn.bcrumbs.net/bc-assets/styles/skin.css"
          />
          <link
            rel="stylesheet"
            href="https://cdn.bcrumbs.net/bc-assets/styles/skeleton.css"
          />
          <link
            rel="stylesheet"
            href="https://cdn.bcrumbs.net/bc-assets/icons/icons.css"
          />
          {/*<link rel="shortcut icon" type="image/x-icon" href={FavIcon} />*/}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
