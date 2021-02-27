import Favourites from "../components/Favourites";
import Search from "../components/Search";
import NearbyStops from "../components/StopsNearby";

import Head from "next/head";

import Logo from "../svgs/catchy-full-logo.svg";

export default function IndexPage({ favourites, stops }) {
  return (
    <>
      <Head>
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
