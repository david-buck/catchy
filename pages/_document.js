import Document, { Html, Head, Main, NextScript } from "next/document";

const APP_NAME = "Catchy";

export default class extends Document {
  static async getInitialProps(ctx) {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <meta name="application-name" content={APP_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={APP_NAME} />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg"></link>
          <link rel="alternate icon" href="/favicon.ico" />

          <title key="title">
            Catchy - Real time updates for Wellington buses
          </title>

          <meta name="twitter:card" content="app" />
          <meta name="twitter:text:title" content="Catchy" />
          <meta
            name="twitter:text:title"
            content="Real time updates for Wellington buses"
          />

          <meta
            property="og:title"
            content="Catchy - Real time updates for Wellington buses"
            key="ogTitle"
          />
          <meta
            name="description"
            content="Real time updates for Wellington buses"
            key="description"
          />
          <meta
            property="og:image"
            content="https://catchy.nz/share/default-share-image.png"
            key="ogImage"
          />
          <link
            rel="preload"
            href="/api/stops"
            as="fetch"
            crossorigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
