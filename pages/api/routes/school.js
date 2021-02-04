import { school_bus_schools } from "../../../data/school_bus_schools";

export default function handler(req, res) {
  res.status(200).json(school_bus_schools);
}
