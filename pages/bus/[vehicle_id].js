import Link from "next/link";
import Head from "next/head";

import Map from "../../components/Map";

import useVehiclePositions from "../../hooks/useVehiclePositions";
import useTripUpdates from "../../hooks/useTripUpdates";
import useStops from "../../hooks/useStops";
import useRoutes from "../../hooks/useRoutes";

import { useRouter } from "next/router";

import RouteBadge from "../../components/RouteBadge";

import CloseCross from "../../svgs/close-cross.svg";
import LocationMarker from "../../svgs/location-mono.svg";
import Clock from "../../svgs/clock.svg";

import Spinner from "../../svgs/spinner.svg";

const getRouteDetails = (id, arr) => {
  const match = arr.find((e) => e.route_short_name === id);

  return match
    ? { color: "#" + match.route_color, type: match.type }
    : { color: "currentColor", type: "school" };
};

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

  let delayMinutes = Math.round(
    currTripUpdate?.trip_update.stop_time_update.arrival.delay / 60
  );

  if (
    vehicle_id === "undefined" ||
    vehicle_id === undefined ||
    (!currTripUpdate && tripUpdates)
  )
    return (
      <div>
        <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10">
          <button onClick={() => router.back()} className="titleBarButton">
            <CloseCross width="24" height="24" title="Back." />
          </button>
        </div>
        <h1 className="text-3xl font-semibold mb-4">Waiting for a bus</h1>
        <p className="mb-4">
          Updates are either unavailable for this bus, or no bus has been
          assigned to your trip yet.
        </p>
        <p>Try again closer to departure time.</p>
      </div>
    );

  if (!currVehiclePostion || !tripUpdates)
    return (
      <Spinner width="24" height="24" className="mt-2 text-yellow-500 mt-6" />
    );

  let routeDetails = getRouteDetails(route.route_short_name, routes);

  return (
    <div>
      <div className="z-10 absolute bg-gradient-to-b from-white dark:from-gray-800 left-0 mx-auto w-full h-3/5">
        <div className="max-w-xl mx-auto px-5">
          <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10">
            <button onClick={() => router.back()} className="titleBarButton">
              <CloseCross width="24" height="24" title="Back." />
            </button>
          </div>
          {/* <div className="text-sm uppercase font-semibold opacity-40 ml-12">
            Bus ID: {vehicle_id}
          </div> */}
          <div className="flex">
            <RouteBadge
              route_color={routeDetails.color}
              route_type={routeDetails.type}
              service_id={route.route_short_name}
              className="mr-3"
            />
            <h1 className="text-xl font-semibold leading-tight mb-2 pt-1">
              {currTripUpdate?.trip_update.trip.trip_id.split("__")[1] === "1"
                ? route.route_long_name
                : route.route_desc}
            </h1>
          </div>

          <div
            className={`${
              delayMinutes > 0
                ? "bg-pink-200 dark:bg-pink-700"
                : "bg-white dark:bg-gray-800"
            } pl-2 pr-4 py-1 rounded-2xl inline-flex mb-2 ml-11`}
          >
            <Clock
              width="16"
              height="16"
              className="ml-0.5 mt-1 mr-1.5 opacity-60 flex-shrink-0"
            />{" "}
            Running{" "}
            {delayMinutes > 0 ? (
              <>
                {delayMinutes} minute{delayMinutes > 1 && <>s</>} late
              </>
            ) : (
              <>on time</>
            )}
          </div>
          <br />
          <div className="bg-white dark:bg-gray-800 ml-11 pl-2 pr-4 py-1 rounded-2xl inline-flex">
            <LocationMarker
              width="16"
              height="16"
              className="text-red-500 mt-1 ml-0.5 mr-1.5 flex-shrink-0"
            />
            Nearby stop: {nearestStop?.stop_name}
          </div>
        </div>
      </div>
      <Map
        lat={currVehiclePostion?.vehicle.position.latitude}
        lng={currVehiclePostion?.vehicle.position.longitude}
        bearing={currVehiclePostion?.vehicle.position.bearing}
      />
    </div>
  );
}
