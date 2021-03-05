import { cable_car_stops } from "../data/cable_car_stops";

export default function App() {
  return (
    <>
      {"{"}
      "features": [
      {cable_car_stops.map((el, key) => {
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
