import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import useVehiclePositions from "../../hooks/useVehiclePositions";
import useTripUpdates from "../../hooks/useTripUpdates";
import useStops from "../../hooks/useStops";
import useRoutes from "../../hooks/useRoutes";

import { useRouter } from "next/router";

export default function BusInfo() {
  const router = useRouter();
  const { vehicle_id } = router.query;
  const { data: vehiclePositions } = useVehiclePositions();
  const { data: tripUpdates } = useTripUpdates();
  const { data: stops } = useStops();
  const { data: routes } = useRoutes();

  const currVehiclePostion = vehiclePositions?.entity.find(
    (e) => e.vehicle.vehicle.id === vehicle_id
  );

  const currTripUpdate = tripUpdates?.entity.find(
    (e) => e.trip_update.vehicle.id === vehicle_id
  );

  const nextStop = stops?.find(
    (e) => e.stop_id === currTripUpdate?.trip_update.stop_time_update.stop_id
  );

  const route = routes?.find(
    (e) =>
      e.route_short_name ===
      currTripUpdate?.trip_update.trip.trip_id.split("__")[0]
  );

  // console.log(currVehiclePostion);
  // console.log(currTripUpdate);

  let delayMinutes = Math.round(
    currTripUpdate?.trip_update.stop_time_update.arrival.delay / 60
  );

  if (
    vehicle_id === "undefined" ||
    vehicle_id === undefined ||
    currTripUpdate === undefined
  )
    return <>No trip data is available</>;

  return (
    <>
      <h1 className="text-3xl font-semibold pt-8">
        {currTripUpdate?.trip_update.trip.trip_id.split("__")[1] === "1"
          ? route.route_long_name
          : route.route_desc}
      </h1>
      <br />
      {delayMinutes > 1 ? <>{delayMinutes} minutes late</> : <>On time</>}
      <br />
      Next stop: {nextStop?.stop_name}
    </>
  );
}
