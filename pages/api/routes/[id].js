import { bus_routes } from "../../../data/bus_routes";
import { train_services } from "../../../data/train_services";

export default function busRouteHandler({ query: { id } }, res) {
  const all_routes = !isNaN(id) ? bus_routes : train_services;
  const filtered = all_routes.filter((p) => p.route_short_name === id);

  // Route with route_short_name exists
  if (filtered.length > 0) {
    res.status(200).json(filtered[0]);
  } else {
    res.status(404).json({ message: `There is no route with id: ${id}.` });
  }
}
