import { useEffect, useState } from "react";
import Head from "next/head";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [isDark, setIsDark] = useState();

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (event.matches) {
          setIsDark(true);
        } else {
          setIsDark(false);
        }
      });
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />

        <meta name="theme-color" content={isDark ? "#1f2937" : "#FFFFFF"} />

        <meta name="twitter:card" content="summary_large_image" />

        <title key="title">
          Catchy - Real time updates for Wellington buses
        </title>

        <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
        <meta
          name="twitter:text:description"
          content="Real time updates for Wellington buses"
          key="twitterDescription"
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
          crossOrigin="anonymous"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
