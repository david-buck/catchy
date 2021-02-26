import { train_stations } from "../../../data/train_stations";

export default function handler(req, res) {
  res.status(200).json(train_stations);
}
