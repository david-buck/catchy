import Head from "next/head";
import Link from "next/link";

import Logo from "../svgs/catchy-full-logo.svg";
import StopMarker from "../svgs/stop-mono-lg.svg";

import Nav from "../components/Nav";
const StopRow = ({ stop_name, stop_id }) => (
  <Link as={`/stop/${stop_id}`} href="/stop/[sms]">
    <a className="transition-colors ease-linear duration-150 flex flex-nowrap py-4 px-5 hover:bg-gray-400 hover:bg-opacity-10 rounded-md pr-4 text-lg">
      <StopMarker
        width="12"
        height="18"
        className={`flex-shrink-0 mt-1 mx-4 ${
          ["KELB", "LAMB"].includes(stop_id) ? "text-red-500" : "text-red-400"
        }`}
      />
      <span>{stop_name}</span>
    </a>
  </Link>
);

export default function CableCar({ cable_car_stops }) {
  return (
    <>
      <Head>
        <title key="title">
          Catchy - Schedules and updates for Wellington cable cars"
        </title>

        <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
        <meta
          name="twitter:text:description"
          content="Schedules and updates for Wellington cable cars"
          key="twitterDescription"
        />

        <meta
          property="og:title"
          content="Catchy - Schedules and updates for Wellington cable car"
          key="ogTitle"
        />
        <meta
          name="description"
          content="Schedules and updates for Wellington cable cars"
          key="description"
        />
      </Head>
      <Nav current="cablecar" />
      <div className="flex flex-col mb-20">
        <div className="mb-6 px-5 pt-5">
          <Logo width="157" height="38" title="Catchy" className="-ml-0.5" />
        </div>
        <h2 className="text-2xl font-semibold mb-1 px-5">
          All cable car stops
        </h2>
        {cable_car_stops.map((el, key) => (
          <StopRow stop_name={el.stop_name} stop_id={el.stop_id} key={key} />
        ))}
      </div>
    </>
  );
}
