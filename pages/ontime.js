import useTripUpdates from "../hooks/useTripUpdates";

// items.sort(function (a, b) {
//     return a.value - b.value;
//   });

export default function OnTime() {
  const { data: tripUpdates } = useTripUpdates();

  const areUpdating = tripUpdates?.entity.filter(
    (e) =>
      Date.parse(new Date()) / 1000 - parseInt(e.trip_update.timestamp) < 60
  );

  const reducer = (accumulator, currentValue) =>
    accumulator + currentValue.trip_update.stop_time_update.arrival.delay;

  const count = areUpdating?.length;

  const countLate = areUpdating?.filter(
    (e) => parseInt(e.trip_update.stop_time_update.arrival.delay) > 0
  ).length;

  const sorted = areUpdating?.sort((a, b) => {
    return (
      a.trip_update.stop_time_update.arrival.delay -
      b.trip_update.stop_time_update.arrival.delay
    );
  });

  const mean = Math.round(areUpdating?.reduce(reducer, 0) / count);

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
