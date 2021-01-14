const durationToSeconds = (iso8601Duration) => {
  const iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;
  let matches = iso8601Duration.match(iso8601DurationRegex);

  let durationSeconds = 0;

  if (matches[6] !== undefined) {
    durationSeconds += parseInt(matches[6]) * 60 * 60;
  }
  if (matches[7] !== undefined) {
    durationSeconds += parseInt(matches[7]) * 60;
  }

  if (matches[8] !== undefined) {
    durationSeconds += parseInt(matches[8]);
  }

  return matches[1] ? -1 * durationSeconds : durationSeconds;
};

export default function Delay({ delay }) {
  let offset = Math.round(durationToSeconds(delay) / 60);
  return offset !== 0 ? (
    <div className="bg-blue-100 rounded-lg px-2">
      {offset} {offset > 0 ? "early" : "late"}
    </div>
  ) : null;
}
