import Link from "next/link";

import StopMarker from "../svgs/stop-mono-lg.svg";

export default function Favourites({ favourites, stops }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-1 px-5">Your favourites</h2>
      {favourites.length === 0 && (
        <aside className="mx-5 py-2 opacity-80">
          Find the stops you use most and add them to your favourites to see
          them here.
        </aside>
      )}
      {favourites && favourites.length > 0 && stops ? (
        <div className="mb-6">
          {favourites.map((element, key) => {
            const stop = stops.find((el) => el.stop_id === element);

            return (
              stop !== undefined && (
                <div key={key}>
                  <Link as={`/stop/${stop.stop_id}`} href="/stop/[sms]">
                    <a className="transition-colors ease-linear duration-150 flex flex-nowrap py-4 px-5 hover:bg-gray-400 hover:bg-opacity-10 rounded-md pr-4 text-lg">
                      <StopMarker
                        width="12"
                        height="18"
                        className="text-yellow-500 flex-shrink-0 mt-1 mx-4"
                      />
                      <span>{stop.stop_name}</span>
                    </a>
                  </Link>
                </div>
              )
            );
          })}
        </div>
      ) : null}
    </>
  );
}
