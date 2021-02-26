import { bus_stops } from "../../../data/bus_stops";

export default function busStopHandler({ query: { sms } }, res) {
  const filtered = bus_stops.filter((p) => p.stop_id === sms);

  // Stop with stop_id exists
  if (filtered.length > 0) {
    res.status(200).json(filtered[0]);
  } else {
    res.status(404).json({ message: `There is no stop with id: ${sms}.` });
  }
}
