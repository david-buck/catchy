import { useEffect, useState } from "react";
import Link from "next/link";

export default function Favourites({ stops }) {
  useEffect(() => {
    setFavourites(JSON.parse(window.localStorage.getItem("favourites")));
  }, []);

  const [favourites, setFavourites] = useState([]);

  return favourites && favourites.length > 0 ? (
    <>
      <h2 className="text-3xl font-semibold mb-6">Your favourites</h2>
      {favourites.map((element, key) => {
        const stop = stops.find((el) => el.stop_id === element);
        return (
          <div key={key} className="mb-6">
            <Link as={`/stop/${stop.stop_id}`} href="/stop/[sms]">
              <a style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{stop.stop_name}</span>
              </a>
            </Link>
          </div>
        );
      })}
    </>
  ) : null;
}
