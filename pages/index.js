import Favourites from "../components/Favourites";
import Search from "../components/Search";
import NearbyStops from "../components/StopsNearby";

export default function IndexPage() {
  return (
    <>
      <Search />
      <Favourites />
      <h2 className="text-3xl font-semibold mb-6">Stops near you</h2>
      <NearbyStops />
    </>
  );
}
