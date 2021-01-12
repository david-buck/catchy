import { bus_stops } from "../../../data/bus_stops";

export default function handler(req, res) {
  res.status(200).json(bus_stops);
}
