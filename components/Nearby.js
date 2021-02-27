import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";

import BusStopMarker from "../svgs/bus-stop-mono.svg";
import MyLocation from "../svgs/my-location.svg";

import Spinner from "../svgs/spinner.svg";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Nearby({ favourites, type }) {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const [locating, setLocating] = useState(false);

  const [cancelled, setCancelled] = useState(false);

  const locate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);

        setLocating(false);
      },
      (error) => {},
      { maximumAge: 60000 }
    );
    setLocating(true);
  };

  useEffect(() => {
    return () => {
      setCancelled(true);
    };
  }, []);

  const { data, error } = useSWR(
    lat && long && !cancelled
      ? `/api/${type === "bus" && "stops"}/${lat}/${long}`
      : null,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  if (error)
    return (
      <div className="py-2 mx-5 text-lg opacity-60">
        Unable to load nearby stops.
      </div>
    );

  if (locating)
    return (
      <div className="py-3 text-lg opacity-60 px-5 mb-4 flex">
        <Spinner width="24" height="24" className="text-yellow-500 mx-2" />
        Finding nearby stops ...
      </div>
    );

  if (!data && !locating)
    return (
      <div className="py-2 text-lg px-5 mb-4">
        <button
          onClick={() => locate()}
          className="py-1 pl-3 pr-6 text-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100  dark:hover:bg-gray-600 rounded-full flex transition-colors focus:outline-none focus-visible:ring-offset-blue-400 focus-visible:ring"
        >
          <span className="text-gray-600 dark:text-gray-300 relative top-1.5 mr-3">
            <MyLocation width="16" height="16" />
          </span>
          Find bus stops near you
        </button>
      </div>
    );

  if (!locating && data)
    return (
      <div>
        <h2 className="text-2xl font-semibold mt-5 mb-1 px-5">
          Stops nearest you
        </h2>
        <div className="mb-8">
          {data.map((element, key) => {
            return (
              <div key={key}>
                <Link as={`/stop/${element.stop_id}`} href="/stop/[sms]">
                  <a className="flex flex-nowrap justify-between space-x-3 pl-5 pr-8 py-3 rounded-md transition-colors ease-linear duration-150 hover:bg-gray-400 hover:bg-opacity-10 text-lg">
                    <span className="flex flex-nowrap items-top">
                      <BusStopMarker
                        width="10"
                        height="16"
                        className={`${
                          favourites?.includes(element.stop_id)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        } flex-shrink-0 mt-1 mx-4`}
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
      </div>
    );
}
