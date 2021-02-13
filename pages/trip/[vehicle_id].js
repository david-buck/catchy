import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

import Map from "../../components/Map";

import useVehiclePositions from "../../hooks/useVehiclePositions";
import useTripUpdates from "../../hooks/useTripUpdates";
import useStops from "../../hooks/useStops";
import useRoutes from "../../hooks/useRoutes";

import { useRouter } from "next/router";

import BackArrow from "../../svgs/navigation-left-arrow.svg";

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

  const nearestStop = stops?.find(
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

  if (!currVehiclePostion) return <>Waiting</>;

  return (
    <div>
      <div className="z-10 absolute bg-gradient-to-b from-white to-transparent dark:from-gray-800 left-0 mx-auto w-full h-3/5">
        <div className="max-w-xl mx-auto px-5">
          <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10">
            <button onClick={() => router.back()} className="titleBarButton">
              <BackArrow width="24" height="24" title="Back." />
            </button>
          </div>
          <h1 className="text-2xl font-semibold leading-tight mb-2 pt-1">
            {currTripUpdate?.trip_update.trip.trip_id.split("__")[1] === "1"
              ? route.route_long_name
              : route.route_desc}
          </h1>

          <div
            className={`${
              delayMinutes > 0
                ? "bg-pink-200 dark:bg-pink-700"
                : "bg-white dark:bg-gray-800"
            } px-4 py-1 rounded-full inline-block mb-2`}
          >
            Running{" "}
            {delayMinutes > 0 ? (
              <>
                {delayMinutes} minute{delayMinutes > 1 && <>s</>} late
              </>
            ) : (
              <>On time</>
            )}
          </div>
          <br />
          <div className="bg-white dark:bg-gray-800 px-4 py-1 rounded-full inline-block">
            Nearest stop: {nearestStop?.stop_name}
          </div>
        </div>
      </div>
      {/* lat={currVehiclePostion?.vehicle.position.latitude}
      <br />
      lng={currVehiclePostion?.vehicle.position.longitude}
      <br />
      bearing={currVehiclePostion?.vehicle.position.bearing}
      <br /> */}
      <Map
        lat={currVehiclePostion?.vehicle.position.latitude}
        lng={currVehiclePostion?.vehicle.position.longitude}
        bearing={currVehiclePostion?.vehicle.position.bearing}
      />
    </div>
  );
}
