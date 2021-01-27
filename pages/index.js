import { useState, useEffect } from "react";
import Link from "next/link";

import Search from "../components/Search";

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function IndexPage() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const locate = () => {
    console.log("locating...");
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
  }, []);

  const { data, error } = useSWR(
    lat && long ? `/api/stops/${lat}/${long}` : null,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  if (error) return <div>failed to load {JSON.stringify(error)}</div>;
  if (!data) return <div>Loading nearby stops...</div>;

  return (
    <>
      <Search />
      <h2 className="text-3xl font-semibold mb-6">Your Favourites</h2>
      <h2 className="text-3xl font-semibold mb-6">Stops near you</h2>
      <div>
        {data.map((element, key) => {
          return (
            <div key={key} className="mb-6">
              <Link as={`/stop/${element.stop_id}`} href="/stop/[sms]">
                <a style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{element.stop_name}</span>
                  <span>{parseFloat(element.distance).toFixed(2)}km</span>
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
