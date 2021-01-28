import { useEffect, useState } from "react";

import Star from "../svgs/star.svg";

export default function FavouriteButton({ sms }) {
  const initialState = () =>
    JSON.parse(window.localStorage.getItem("favourites")) || [];

  const [favourites, setFavourites] = useState(initialState);

  useEffect(() => {
    window.localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = (value) => {
    setFavourites([...favourites, value]);
  };

  const removeFavourite = (value) => {
    setFavourites(favourites.filter((item) => item !== value));
  };

  return favourites && favourites.includes(sms) ? (
    <div
      role="button"
      onClick={() => removeFavourite(sms)}
      className="text-yellow-500"
    >
      <Star width="24" height="24" />
    </div>
  ) : (
    <div
      role="button"
      onClick={() => addFavourite(sms)}
      className="text-gray-300 dark:text-gray-600"
    >
      <Star width="24" height="24" />
    </div>
  );
}
