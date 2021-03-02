import { useRouter } from "next/router";
import Head from "next/head";
import CloseCross from "../../svgs/close-cross.svg";

export default function noBus({ previousPages }) {
  const router = useRouter();
  return (
    <div className="px-5">
      <Head>
        <meta name="robots" content="noindex" />
        <title key="title">Catchy - Waiting for a train</title>

        <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
        <meta
          name="twitter:text:description"
          content="Updates unavailable"
          key="twitterDescription"
        />

        <meta
          property="og:title"
          content="Catchy - Waiting for a train"
          key="ogTitle"
        />
        <meta
          name="description"
          content="Updates unavailable"
          key="description"
        />
      </Head>
      <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10">
        <button
          onClick={() =>
            previousPages.length > 1 ? router.back() : router.push("/")
          }
          className="titleBarButton"
        >
          <CloseCross width="24" height="24" title="Back." />
        </button>
      </div>
      <h1 className="text-3xl font-semibold mb-4">Waiting for a train</h1>

      <p className="mb-4">
        Updates are either unavailable for this train, or no train has been
        assigned to your trip yet.
      </p>
      <p className="mb-4">
        Unfortunately, updates aren't provided for bus replacement services.
      </p>
      <p>Try again closer to departure time.</p>
    </div>
  );
}
