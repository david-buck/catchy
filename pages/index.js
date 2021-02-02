import Favourites from "../components/Favourites";
import Search from "../components/Search";
import NearbyStops from "../components/StopsNearby";

import useSWR from "swr";
import Head from "next/head";

import Logo from "../svgs/catchy-full-logo.svg";
import Spinner from "../svgs/spinner.svg";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function IndexPage() {
  const { data: stops, isValidating, error } = useSWR(`/api/stops`, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  if (error) return <div>failed to load {JSON.stringify(error)}</div>;
  if (!stops)
    return <Spinner width="24" height="24" className="mt-2 text-gray-500" />;

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
        <div className="mb-3 mt-1">
          <Logo width="157" height="38" title="Catchy" className=" -ml-0.5" />
        </div>
        <Search stops={stops} />
        <Favourites stops={stops} />
        <h2 className="text-3xl font-semibold mb-3">Stops near you</h2>
        <NearbyStops />
      </div>
    </>
  );
}
