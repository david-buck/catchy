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
  if (!stops) return <Spinner width="24" height="24" className="mt-2" />;

  return (
    <div className="flex flex-col">
      <Head>
        <title key="title">
          Catchy - Real time updates for Wellington buses
        </title>
        <meta
          property="og:title"
          content="Catchy - Real time updates for Wellington buses"
          key="ogTitle"
        />
        <meta
          name="description"
          content="At Mobi2Go we are fuelled by purpose and united by food. We’re
          on a mission to make digital ordering as easy as opening the
          fridge."
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
      <div className="mb-3 mt-1">
        <Logo width="157" height="38" title="Catchy" />
      </div>
      <Search stops={stops} />
      <Favourites stops={stops} />
      <h2 className="text-3xl font-semibold mb-6">Stops near you</h2>
      <NearbyStops />
    </div>
  );
}
