import Link from "next/link";

import CloseCross from "../svgs/close-cross.svg";

export default function about() {
  return (
    <div className="px-5">
      <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10">
        <Link href="/">
          <a className="titleBarButton">
            <CloseCross width="24" height="24" title="Catchy main screen." />
          </a>
        </Link>
      </div>
      <h1 className="text-3xl font-semibold mb-4">About Catchy</h1>

      <p className="mb-4">
        Catchy is a free and independent service for people who know what bus
        they need to catch and where they catch it from.
      </p>
      <p className="mb-4">
        You can find the stops you use most and add them to a list of your
        favourites.
      </p>
      <p className="mb-4">
        Catchy helps you see if your bus is running on time and lets you check
        on where it is by showing you the bus's progress on a map.
      </p>
      <p className="font-semibold">Catchy is:</p>
      <ul className="list-inside list-disc mb-4 pl-2">
        <li>accurate.</li>
        <li>fast and accessible.</li>
        <li>mobile-first.</li>
        <li>constantly improving.</li>
        <li>
          <a href="/privacy" className="text-blue-500">
            private
          </a>
          .
        </li>
      </ul>

      <p className="mb-4">
        For updates, follow{" "}
        <a href="https://twitter.com/catchy_nz" className="text-blue-500">
          @catchy_nz
        </a>{" "}
        on Twitter.
      </p>
      <p className="mb-12">
        Feedback is welcome, either on Twitter (DMs are open) or to{" "}
        <a href="mailto:feedback@catchy.nz" className="text-blue-500">
          feedback@catchy.nz
        </a>
        .
      </p>
      <h2 className="font-semibold text-lg mb-4">Credits</h2>
      <p className="mb-4">
        Design, illustration and custom fonts by{" "}
        <a href="https://david.buck.nz" className="text-blue-500">
          David Buck
        </a>
        .
      </p>
      <p className="mb-4">
        Technology used:{" "}
        <a href="https://nextjs.org/" className="text-blue-500">
          Next.js
        </a>{" "}
        and{" "}
        <a href="https://swr.vercel.app/" className="text-blue-500">
          SWR
        </a>{" "}
        by{" "}
        <a href="https://vercel.com/" className="text-blue-500">
          Vercel
        </a>
        ,{" "}
        <a href="https://www.mapbox.com/" className="text-blue-500">
          Mapbox
        </a>
        , and{" "}
        <a href="https://www.metlink.org.nz/" className="text-blue-500">
          Metlink
        </a>
        ’s{" "}
        <a href="https://opendata.metlink.org.nz/" className="text-blue-500">
          APIs
        </a>
      </p>
    </div>
  );
}
