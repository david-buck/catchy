import Favourites from "../components/Favourites";
import Search from "../components/Search";
import NearbyStops from "../components/StopsNearby";

import Head from "next/head";

import Logo from "../svgs/catchy-full-logo.svg";
import Spinner from "../svgs/spinner.svg";

export default function IndexPage() {
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
        <div className="mb-2 pt-5">
          <Logo width="157" height="38" title="Catchy" className="-ml-0.5" />
        </div>

        <Search />
        <Favourites />

        <h2 className="text-3xl font-semibold mb-3">Stops near you</h2>
        <NearbyStops />
      </div>
    </>
  );
}
