import { useEffect, useState } from "react";

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
    <div role="button" onClick={() => removeFavourite(sms)}>
      Favourited
    </div>
  ) : (
    <div role="button" onClick={() => addFavourite(sms)}>
      Add to favourites
    </div>
  );
}
