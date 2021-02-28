import { all_routes } from "../../../data/all_routes";

export default function handler(req, res) {
  res.status(200).json(all_routes);
}
