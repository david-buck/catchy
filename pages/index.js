import Favourites from "../components/Favourites";
import Search from "../components/Search";
import NearbyStops from "../components/StopsNearby";

import useSWR from "swr";
import Head from "next/head";

import Logo from "../svgs/catchy-full-logo.svg";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function IndexPage() {
  const { data: stops, isValidating, error } = useSWR(`/api/stops`, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  if (error) return <div>failed to load {JSON.stringify(error)}</div>;
  if (!stops) return <div>Loading nearby stops...</div>;

  return (
    <div className="flex flex-col">
      <Head>
        <link
          rel="preload"
          href="/api/stops"
          as="fetch"
          crossorigin="anonymous"
        />
      </Head>
      <div className="mb-2">
        <Logo width="157" height="38" title="Catchy" />
      </div>
      <Search stops={stops} />
      <Favourites stops={stops} />
      <h2 className="text-3xl font-semibold mb-6">Stops near you</h2>
      <NearbyStops />
    </div>
  );
}
