import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";

import LocationMarker from "../svgs/location-mono.svg";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NearbyStops() {
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

  if (error) return <div>Unable to load nearby stops.</div>;
  if (!data) return <div>Loading nearby stops...</div>;

  return (
    <>
      <div>
        {data.map((element, key) => {
          return (
            <div key={key}>
              <Link as={`/stop/${element.stop_id}`} href="/stop/[sms]">
                <a className="flex flex-nowrap justify-between space-x-3 py-3 pr-4 rounded-md transition-colors ease-linear duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 ">
                  <span className="flex flex-nowrap items-top">
                    <LocationMarker
                      width="40"
                      height="18"
                      className="text-gray-300 flex-shrink-0 mt-1"
                    />
                    {element.stop_name}
                  </span>
                  <span className="flex-shrink-0">
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
    </>
  );
}
