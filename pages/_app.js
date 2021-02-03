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

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      wb.addEventListener("installed", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("controlling", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("activated", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      const promptNewVersionAvailable = (event) => {
        if (
          confirm("A newer version of Catchy is available, reload to update?")
        ) {
          wb.addEventListener("controlling", (event) => {
            console.log(`Event ${event.type} is triggered.`);
            console.log(event);
            window.location.reload();
          });

          wb.messageSW({ type: "SKIP_WAITING" });
        } else {
          console.log(
            "User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time."
          );
        }
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);
      wb.addEventListener("externalwaiting", promptNewVersionAvailable);

      wb.register();
    }
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
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
