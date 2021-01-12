import { bus_routes } from "../../../data/bus_routes";

export default function handler(req, res) {
  res.status(200).json(bus_routes);
}
