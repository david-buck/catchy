import { useEffect, useState } from "react";
import Head from "next/head";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [isDark, setIsDark] = useState();
  const [previousPages, setPreviousPages] = useState([]);

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
    previousPages[previousPages.length - 1] !== document.location.href &&
      setPreviousPages([...previousPages, document.location.href]);
  });

  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    setFavourites(JSON.parse(window.localStorage.getItem("favourites")) || []);
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

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      // const promptNewVersionAvailable = (event) => {
      //   // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
      //   // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
      //   // You may want to customize the UI prompt accordingly.
      //   if (
      //     confirm("A newer version of Catchy is available, reload to update?")
      //   ) {
      //     wb.addEventListener("controlling", (event) => {
      //       window.location.reload();
      //     });

      //     // Send a message to the waiting service worker, instructing it to activate.
      //     wb.messageSW({ type: "SKIP_WAITING" });
      //   } else {
      //     console.log(
      //       "User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time."
      //     );
      //   }
      // };

      // wb.addEventListener("waiting", promptNewVersionAvailable);
      // wb.addEventListener("externalwaiting", promptNewVersionAvailable);

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
      </Head>
      <Component
        previousPages={previousPages}
        favourites={favourites}
        setFavourites={setFavourites}
        {...pageProps}
      />
    </>
  );
}

export default MyApp;
