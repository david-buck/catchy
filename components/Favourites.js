import { useEffect, useState } from "react";
import Link from "next/link";

import useStops from "../hooks/useStops";

import LocationMarker from "../svgs/location-mono.svg";

export default function Favourites() {
  useEffect(() => {
    setFavourites(JSON.parse(window.localStorage.getItem("favourites")));
  }, []);

  const [favourites, setFavourites] = useState([]);

  const { data: stops, isValidating, error } = useStops();

  return favourites && favourites.length > 0 && stops ? (
    <div className="mb-6">
      <h2 className="text-3xl font-semibold mb-3 px-5">Your favourites</h2>
      {favourites.map((element, key) => {
        const stop = stops.find((el) => el.stop_id === element);
        return (
          <div key={key}>
            <Link as={`/stop/${stop.stop_id}`} href="/stop/[sms]">
              <a className="transition-colors ease-linear duration-150 flex flex-nowrap py-4 px-5 hover:bg-gray-400 hover:bg-opacity-10 rounded-md pr-4 text-lg">
                <LocationMarker
                  width="38"
                  height="18"
                  className="text-yellow-500 flex-shrink-0 mt-1 ml-0.5"
                />
                <span>{stop.stop_name}</span>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  ) : null;
}
