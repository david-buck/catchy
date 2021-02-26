import Head from "next/head";
import Link from "next/link";
import CloseCross from "../svgs/close-cross.svg";

export default function privacy() {
  return (
    <div className="px-5">
      <Head>
        <meta
          property="og:image"
          content="https://catchy.nz/share/privacy-share-image.png"
          key="ogImage"
        />
      </Head>
      <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10">
        <Link href="/">
          <a className="titleBarButton">
            <CloseCross width="24" height="24" title="Catchy main screen." />
          </a>
        </Link>
      </div>
      <h1 className="text-3xl font-semibold mb-4">Privacy</h1>

      <p className="mb-4">
        You just want to catch a bus without someone looking over your shoulder
        at what you’re doing.
      </p>
      <p className="mb-4">
        <a href="https://themarkup.org/blacklight?url=catchy.nz">
          Catchy doesn’t track you
        </a>
        . No third-party trackers or cookies are used at all.
      </p>
      <p className="mb-4">
        Our web host, Vercel, has{" "}
        <a
          href="https://vercel.com/legal/privacy-policy#customers"
          className="text-blue-500"
        >
          provided details
        </a>{" "}
        about what data they collect about you (the “end-user”). If you are
        concerned about what they do with your idetinfying data, you should
        probably read it.
      </p>
      <p className="mb-4">
        If you have any questions or concerns about Catchy’s use of your data,
        contact{" "}
        <a href="mailto:feedback@catchy.nz" className="text-blue-500">
          feedback@catchy.nz
        </a>
      </p>
    </div>
  );
}
