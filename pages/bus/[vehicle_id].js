import Head from "next/head";

import Map from "../../components/Map";

import usevehiclePositions from "../../hooks/useVehiclePositions";
import useTripUpdates from "../../hooks/useTripUpdates";
import useStops from "../../hooks/useStops";
import useRoutes from "../../hooks/useRoutes";
import useSchoolRoutes from "../../hooks/useSchoolRoutes";

import { useRouter } from "next/router";

import RouteBadge from "../../components/RouteBadge";

import CloseCross from "../../svgs/close-cross.svg";
import StopMarker from "../../svgs/stop-mono.svg";
import Clock from "../../svgs/clock.svg";

import Spinner from "../../svgs/spinner.svg";

const getRouteDetails = (id, arr) => {
  const match = arr.find((e) => e.route_short_name === id);

  return match
    ? { color: "#" + match.route_color, type: match.type }
    : { color: "currentColor", type: "school" };
};

export default function BusInfo({ previousPages, isDark }) {
  const router = useRouter();
  const { vehicle_id } = router.query;
  const {
    data: vehiclePosition,
    isError: vehiclePositionError,
  } = usevehiclePositions(vehicle_id);
  const { data: tripUpdate, isError: tripUpdateError } = useTripUpdates(
    vehicle_id
  );
  const { data: stops } = useStops();
  const { data: routes } = useRoutes();
  const { data: school_routes } = useSchoolRoutes();

  const nearestStop = stops?.find(
    (e) => e.stop_id === tripUpdate?.trip_update?.stop_time_update.stop_id
  );

  const service_id = tripUpdate?.trip_update?.trip.trip_id.split("__")[0];

  const route = routes?.find((e) => e.route_short_name === service_id);

  const routeDetails = route
    ? getRouteDetails(route.route_short_name, routes)
    : { color: "currentColor", type: "school" };

  let delayMinutes = Math.round(
    tripUpdate?.trip_update?.stop_time_update.arrival.delay / 60
  );

  if (!vehiclePosition || !tripUpdate)
    return (
      <Spinner width="24" height="24" className="text-yellow-500 mt-6 ml-5" />
    );

  if (vehicle_id === undefined || tripUpdate.message)
    return (
      <div className="px-5">
        <Head>
          <meta name="robots" content="noindex" />
          <title key="title">Catchy - Waiting for a bus</title>

          <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
          <meta
            name="twitter:text:description"
            content="Updates unavailable"
            key="twitterDescription"
          />

          <meta
            property="og:title"
            content="Catchy - Waiting for a bus"
            key="ogTitle"
          />
          <meta
            name="description"
            content="Updates unavailable"
            key="description"
          />
        </Head>
        <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10">
          <button
            onClick={() =>
              previousPages.length > 1 ? router.back() : router.push("/")
            }
            className="titleBarButton"
          >
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

  return (
    <div>
      <Head>
        <meta name="robots" content="noindex" />
        <title key="title">Catchy - Live bus updates</title>

        <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
        <meta
          name="twitter:text:description"
          content="Live updates for a bus"
          key="twitterDescription"
        />

        <meta
          property="og:title"
          content="Catchy – Live bus updates"
          key="ogTitle"
        />
        <meta
          name="description"
          content="Live updates for a bus"
          key="description"
        />
      </Head>
      <div className="z-10 absolute bg-gradient-to-b from-white dark:from-gray-800 left-0 mx-auto w-full h-3/5 max-h-96 pointer-events-none">
        <div className="max-w-xl mx-auto px-5 pointer-events-auto">
          <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10 ">
            <button
              onClick={() =>
                previousPages.length > 1 ? router.back() : router.push("/")
              }
              className="titleBarButton"
            >
              <CloseCross width="24" height="24" title="Back." />
            </button>
          </div>

          <div className="flex">
            <RouteBadge
              route_color={routeDetails?.color}
              route_type={routeDetails?.type}
              service_id={service_id}
              className="mr-3"
            />
            <h1 className="text-xl font-semibold leading-tight mb-2 pt-1">
              {routeDetails?.type !== "school" ? (
                tripUpdate?.trip_update.trip.trip_id.split("__")[1] === "1" ? (
                  route?.route_long_name
                ) : (
                  route?.route_desc
                )
              ) : (
                <span>
                  School Bus{" "}
                  <span className="text-sm opacity-60 leading-none">
                    <br />
                    {
                      school_routes.find(
                        (el) => el.route_short_name === service_id
                      ).schools
                    }
                  </span>
                </span>
              )}
            </h1>
          </div>

          <div
            className={`${
              delayMinutes > 2 || delayMinutes < -1
                ? "bg-pink-200 dark:bg-pink-700"
                : "bg-white dark:bg-gray-800"
            } pl-2 pr-4 py-1 rounded-2xl inline-flex mb-2 ml-11`}
          >
            <Clock
              width="16"
              height="16"
              className="ml-0.5 mt-1 mr-1.5 opacity-70 flex-shrink-0 "
            />{" "}
            Running{" "}
            {delayMinutes > 0 ? (
              <>
                {delayMinutes} minute{delayMinutes > 1 && <>s</>} late
              </>
            ) : delayMinutes < 0 ? (
              <>
                {Math.abs(delayMinutes)} minute
                {Math.abs(delayMinutes) > 1 && <>s</>} early
              </>
            ) : (
              <>on time</>
            )}
          </div>
          <br />
          <div className="bg-white dark:bg-gray-800 ml-11 pl-2 pr-4 py-1 rounded-2xl inline-flex">
            <StopMarker
              width="16"
              height="16"
              className="text-yellow-500 mt-1 ml-0.5 mr-1.5 flex-shrink-0"
            />
            Nearby stop: {nearestStop?.stop_name}
          </div>
        </div>
      </div>
      <Map
        lat={vehiclePosition?.vehicle.position.latitude}
        lng={vehiclePosition?.vehicle.position.longitude}
        bearing={vehiclePosition?.vehicle.position.bearing}
        bearingOffset={0}
        isDark={isDark}
      />
    </div>
  );
}
