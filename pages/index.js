import Favourites from "../components/Favourites";
import Search from "../components/Search";
import NearbyStops from "../components/StopsNearby";

import Head from "next/head";

import useStops from "../hooks/useStops";

import Logo from "../svgs/catchy-full-logo.svg";

export default function IndexPage({ favourites }) {
  const { data: stops } = useStops();
  return (
    <>
      <Head>
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
      <div className="flex flex-col">
        <div className="mb-2 px-5 pt-5">
          <Logo width="157" height="38" title="Catchy" className="-ml-0.5" />
        </div>

        <Search favourites={favourites} stops={stops} />
        <Favourites favourites={favourites} stops={stops} />
        <NearbyStops favourites={favourites} />
      </div>
    </>
  );
}
