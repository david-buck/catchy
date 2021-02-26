import Search from "../components/Search";

import Head from "next/head";

import useStations from "../hooks/useStations";

import Logo from "../svgs/catchy-full-logo.svg";

export default function IndexPage({ favourites }) {
  const { data: stops } = useStations();
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/api/stations"
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="flex flex-col">
        <div className="mb-2 px-5 pt-5">
          <Logo width="157" height="38" title="Catchy" className="-ml-0.5" />
        </div>

        <Search favourites={favourites} stops={stops} />
      </div>
    </>
  );
}
