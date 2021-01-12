import { useState, useEffect } from "react";
import Link from "next/link";

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function IndexPage() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const locate = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  };

  const { data, error } = useSWR(
    lat ? `/api/stops/${lat}/${long}` : null,
    fetcher,
    {
      refreshInterval: 0,
    }
  );

  return (
    <div>
      <div role="button" onClick={() => locate()}>
        Click me to find stops nearby
      </div>
      {data &&
        data.map((element, key) => {
          return (
            <div>
              <Link as={`/stop/${element.stop_id}`} href="/stop/[sms]">
                <a>{element.stop_name}</a>
              </Link>
            </div>
          );
        })}
    </div>
  );
}
