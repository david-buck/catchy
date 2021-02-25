import { bus_stops } from "../data/bus_stops";

export default function App() {
  return (
    <>
      {"{"}
      "features": [
      {bus_stops.map((el, key) => {
        return (
          JSON.stringify({
            type: "Feature",
            properties: {
              title: el.stop_name,
            },
            geometry: {
              coordinates: [el.stop_lon, el.stop_lat],
              type: "Point",
            },
          }) + ","
        );
      })}
      {"}"}
      ], "type": "FeatureCollection"
      {"}"}
    </>
  );
}
