import { bus_routes } from "../../../data/bus_routes";

export default function busRouteHandler({ query: { id } }, res) {
  const filtered = bus_routes.filter((p) => p.route_short_name === id);

  // Route with route_short_name exists
  if (filtered.length > 0) {
    res.status(200).json(filtered[0]);
  } else {
    res.status(404).json({ message: `There is no route with id: ${id}.` });
  }
}
