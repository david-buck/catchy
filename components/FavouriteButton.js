import { useEffect, useState } from "react";

import Star from "../svgs/star.svg";

export default function FavouriteButton({ sms, favourites, setFavourites }) {
  useEffect(() => {
    window.localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (value) => {
    favourites?.includes(sms)
      ? setFavourites(favourites.filter((item) => item !== value))
      : setFavourites([...favourites, value]);
  };

  return (
    favourites && (
      <button
        role="button"
        onClick={() => toggleFavourite(sms)}
        className="titleBarButton"
      >
        <Star
          width="24"
          height="24"
          className={
            favourites.includes(sms)
              ? "text-yellow-500"
              : "text-gray-300 dark:text-gray-600"
          }
          title={
            favourites.includes(sms)
              ? "Remove from favourites."
              : "Add to favourites"
          }
        />
      </button>
    )
  );
}
