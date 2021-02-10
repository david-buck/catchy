import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import useVehiclePositions from "../../hooks/useVehiclePositions";
import useTripUpdates from "../../hooks/useTripUpdates";

import { useRouter } from "next/router";

export default function BusInfo() {
  const router = useRouter();
  const { vehicle_id } = router.query;
  const { data: vehiclePositions } = useVehiclePositions();
  const { data: tripUpdates } = useTripUpdates();

  const currVehiclePostion = vehiclePositions?.entity.find(
    (e) => e.vehicle.vehicle.id === vehicle_id
  );

  const currTripUpdate = tripUpdates?.entity.find(
    (e) => e.trip_update.vehicle.id === vehicle_id
  );
  return (
    <>
      {JSON.stringify(currVehiclePostion)}
      {JSON.stringify(currTripUpdate)}
    </>
  );
}
