export default function localTime(req, res) {
  res.status(200).json({ date: new Date() });
}
