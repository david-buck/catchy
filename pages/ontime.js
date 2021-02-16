import useTripUpdates from "../hooks/useTripUpdates";

// items.sort(function (a, b) {
//     return a.value - b.value;
//   });

export default function OnTime() {
  const { data: tripUpdates } = useTripUpdates();

  const reducer = (accumulator, currentValue) =>
    accumulator + currentValue.trip_update.stop_time_update.arrival.delay;

  const count = tripUpdates?.entity.length;

  const countLate = tripUpdates?.entity.filter(
    (e) => parseInt(e.trip_update.stop_time_update.arrival.delay) > 0
  ).length;

  const sorted = tripUpdates?.entity.sort((a, b) => {
    return (
      a.trip_update.stop_time_update.arrival.delay -
      b.trip_update.stop_time_update.arrival.delay
    );
  });

  const mean = Math.round(tripUpdates?.entity.reduce(reducer, 0) / count);

  return tripUpdates ? (
    <div>
      <p>Number of buses sending updates: {count}</p>
      <p>
        Running late: {countLate} ({((countLate / count) * 100).toFixed(1)}%)
      </p>
      <p>
        Median delay{" "}
        {
          sorted[Math.ceil(count / 2)].trip_update.stop_time_update.arrival
            .delay
        }{" "}
        seconds
      </p>
      <p>Mean delay: {mean} seconds</p>
      <p>
        Most delayed: {sorted[count - 1].trip_update.trip.trip_id} by{" "}
        {sorted[count - 1].trip_update.stop_time_update.arrival.delay} seconds
      </p>
    </div>
  ) : null;
}
