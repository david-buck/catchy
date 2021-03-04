import Head from "next/head";

import Nav from "../components/Nav";
import Search from "../components/Search";
import Nearby from "../components/Nearby";
import Favourites from "../components/Favourites";

import Logo from "../svgs/catchy-full-logo.svg";

export default function IndexPage({ favourites, train_stations: stops }) {
  return (
    <>
      <Head>
        <title key="title">
          Catchy - Real time updates for Wellington trains
        </title>

        <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
        <meta
          name="twitter:text:description"
          content="Real time updates for Wellington trains"
          key="twitterDescription"
        />

        <meta
          property="og:title"
          content="Catchy - Real time updates for Wellington trains"
          key="ogTitle"
        />
        <meta
          name="description"
          content="Real time updates for Wellington trains"
          key="description"
        />
      </Head>
      <Nav current="train" />
      <div className="flex flex-col mb-20">
        <div className="mb-2 px-5 pt-5">
          <Logo width="157" height="38" title="Catchy" className="-ml-0.5" />
        </div>

        <Search favourites={favourites} stops={stops} type="train" />
        <Nearby type="train" favourites={favourites} />
        <Favourites favourites={favourites} stops={stops} type="train" />
      </div>
    </>
  );
}
