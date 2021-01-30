import { useEffect, useState } from "react";

import Star from "../svgs/star.svg";

export default function FavouriteButton({ sms }) {
  const initialState = () =>
    JSON.parse(window.localStorage.getItem("favourites")) || [];

  const [favourites, setFavourites] = useState(initialState);

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
        className={`transition-colors ease-linear duration-150 -mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none  ${
          favourites.includes(sms)
            ? "text-yellow-500"
            : "text-gray-300 dark:text-gray-600"
        }`}
      >
        <Star
          width="24"
          height="24"
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
