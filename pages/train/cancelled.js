import { useRouter } from "next/router";
import CloseCross from "../../svgs/close-cross.svg";

export default function noBus({ previousPages }) {
  const router = useRouter();
  return (
    <div className="px-5">
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
