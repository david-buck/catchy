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

  useEffect(() => {
    locate();
  }, []);

  const { data, error } = useSWR(
    lat ? `/api/stops/${lat}/${long}` : null,
    fetcher,
    {
      refreshInterval: 0,
    }
  );

  if (error) return <div>failed to load {JSON.stringify(error)}</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      {data.map((element, key) => {
        return (
          <div key={key}>
            <Link as={`/stop/${element.stop_id}`} href="/stop/[sms]">
              <a>{element.stop_name}</a>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
