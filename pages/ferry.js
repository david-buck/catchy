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
          ["9999", "9997"].includes(stop_id) ? "text-blue-500" : "text-blue-300"
        }`}
      />
      <span>{stop_name}</span>
    </a>
  </Link>
);

export default function Ferry({ ferry_stops }) {
  return (
    <>
      <Head>
        <title key="title">
          Catchy - Live timetables and updates for Wellington ferries"
        </title>

        <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
        <meta
          name="twitter:text:description"
          content="Live timetables and updates for Wellington ferries"
          key="twitterDescription"
        />

        <meta
          property="og:title"
          content="Catchy - Live timetables and updates for Wellington ferries"
          key="ogTitle"
        />
        <meta
          name="description"
          content="Live timetables and updates for Wellington ferries"
          key="description"
        />
      </Head>
      <Nav current="ferry" />
      <div className="flex flex-col mb-20">
        <div className="mb-3 px-5 pt-5">
          <Logo width="157" height="38" title="Catchy" className="-ml-0.5" />
        </div>
        {ferry_stops.map((el, key) => (
          <StopRow stop_name={el.stop_name} stop_id={el.stop_id} key={key} />
        ))}
      </div>
    </>
  );
}
