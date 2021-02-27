import Favourites from "../components/Favourites";
import Search from "../components/Search";
import Nearby from "../components/Nearby";

import Logo from "../svgs/catchy-full-logo.svg";

export default function IndexPage({ favourites, stops }) {
  return (
    <>
      <div className="flex flex-col">
        <div className="mb-2 px-5 pt-5">
          <Logo width="157" height="38" title="Catchy" className="-ml-0.5" />
        </div>

        <Search favourites={favourites} stops={stops} />
        <Nearby type="bus" favourites={favourites} />
        <Favourites favourites={favourites} stops={stops} />
      </div>
    </>
  );
}
