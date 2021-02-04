import { useEffect, useState } from "react";
import Link from "next/link";

import LocationMarker from "../svgs/location-mono.svg";

export default function Favourites({ stops }) {
  useEffect(() => {
    setFavourites(JSON.parse(window.localStorage.getItem("favourites")));
  }, []);

  const [favourites, setFavourites] = useState([]);

  return favourites && favourites.length > 0 ? (
    <div className="mb-6">
      <h2 className="text-3xl font-semibold mb-3">Your favourites</h2>
      {favourites.map((element, key) => {
        const stop = stops.find((el) => el.stop_id === element);
        return (
          <div key={key}>
            <Link as={`/stop/${stop.stop_id}`} href="/stop/[sms]">
              <a className="transition-colors ease-linear duration-150 flex flex-nowrap py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md pr-4">
                <LocationMarker
                  width="40"
                  height="18"
                  className="text-yellow-500 flex-shrink-0 mt-1"
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
