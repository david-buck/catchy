import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";

import BusStopMarker from "../svgs/bus-stop-mono.svg";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NearbyStops({ favourites }) {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const [cancelled, setCancelled] = useState(false);

  const locate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      (error) => {},
      { maximumAge: 60000 }
    );
  };

  useEffect(() => {
    locate();
    return () => {
      setCancelled(true);
    };
  }, []);

  const { data, error } = useSWR(
    lat && long && !cancelled ? `/api/stops/${lat}/${long}` : null,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  if (error)
    return (
      <div className="py-2 text-lg opacity-60">
        Unable to load nearby stops.
      </div>
    );
  if (!data)
    return (
      <div className="py-2 text-lg opacity-60 px-5">
        Finding stops nearest you...
      </div>
    );

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-3 px-5">Stops near you</h2>
      {data.map((element, key) => {
        return (
          <div key={key}>
            <Link as={`/stop/${element.stop_id}`} href="/stop/[sms]">
              <a className="flex flex-nowrap justify-between space-x-3 pl-5 pr-8 py-3 rounded-md transition-colors ease-linear duration-150 hover:bg-gray-400 hover:bg-opacity-10 text-lg">
                <span className="flex flex-nowrap items-top">
                  <BusStopMarker
                    width="38"
                    height="18"
                    className={`${
                      favourites?.includes(element.stop_id)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    } flex-shrink-0 mt-1 ml-0.5`}
                  />
                  {element.stop_name}
                </span>
                <span className="flex-shrink-0 opacity-60">
                  {element.distance < 1000
                    ? parseInt(element.distance * 1000) + " metres"
                    : parseFloat(element.distance).toFixed(2) + " km"}
                </span>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
