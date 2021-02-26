import { train_stations } from "../../../data/train_stations";

export default function trainStationHandler({ query: { sms } }, res) {
  const filtered = train_stations.filter((p) => p.stop_id === sms);

  // Station with stop_id exists
  if (filtered.length > 0) {
    res.status(200).json(filtered[0]);
  } else {
    res.status(404).json({ message: `There is no station with id: ${sms}.` });
  }
}
