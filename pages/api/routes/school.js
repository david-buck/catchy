import { school_bus_routes } from "../../../data/school_bus_routes";

export default function handler(req, res) {
  res.status(200).json(school_bus_routes);
}
