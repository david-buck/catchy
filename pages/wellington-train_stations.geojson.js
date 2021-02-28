import { train_stations } from "../data/train_stations";

export default function App() {
  return (
    <>
      {"{"}
      "features": [
      {train_stations.map((el, key) => {
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
