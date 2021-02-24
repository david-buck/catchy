import CloseCross from "../svgs/close-cross.svg";

export default function privacy() {
  return (
    <div className="px-5">
      <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10">
        <a href="/" className="titleBarButton">
          <CloseCross width="24" height="24" title="Back." />
        </a>
      </div>
      <h1 className="text-3xl font-semibold mb-4">Privacy</h1>

      <p className="mb-4">
        You just want to catch a bus without someone looking over your shoulder
        at what you’re doing.
      </p>
      <p className="mb-4">
        Catchy doesn’t track you. There are no third-party trackers or cookies
        used at all.
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
        contact feedback@catchy.nz
      </p>
    </div>
  );
}
