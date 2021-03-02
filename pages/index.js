import Nav from "../components/Nav";
import Search from "../components/Search";
import Nearby from "../components/Nearby";
import Favourites from "../components/Favourites";

import Logo from "../svgs/catchy-full-logo.svg";

export default function IndexPage({ favourites, bus_stops: stops }) {
  return (
    <>
      <Nav current="bus" />
      <div className="flex flex-col mb-20">
        <div className="mb-2 px-5 pt-5">
          <Logo width="157" height="38" title="Catchy" className="-ml-0.5" />
        </div>

        <Search favourites={favourites} stops={stops} type="bus" />
        <Nearby favourites={favourites} type="bus" />
        <Favourites favourites={favourites} stops={stops} type="bus" />
      </div>
    </>
  );
}
