import { useRouter } from "next/router";
import Head from "next/head";
import CloseCross from "../../svgs/close-cross.svg";

export default function NoTrain({ previousPages }) {
  const router = useRouter();
  return (
    <div className="px-5">
      <Head>
        <meta name="robots" content="noindex" />
        <title key="title">Catchy - Train cancelled</title>

        <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
        <meta
          name="twitter:text:description"
          content="Updates unavailable"
          key="twitterDescription"
        />

        <meta
          property="og:title"
          content="Catchy - Train Cancelled"
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
      <h1 className="text-3xl font-semibold mb-4 text-red-500">
        Train cancelled
      </h1>

      <p className="mb-4">This train has been cancelled.</p>
    </div>
  );
}
