import { useEffect, useState } from "react";
import Head from "next/head";

import Map from "../../components/Map";

import usevehiclePositions from "../../hooks/useVehiclePositions";
import useTripUpdates from "../../hooks/useTripUpdates";
import useStops from "../../hooks/useStops";
import useRoutes from "../../hooks/useRoutes";

import { useRouter } from "next/router";

import RouteBadge from "../../components/RouteBadge";

import CloseCross from "../../svgs/close-cross.svg";
import Clock from "../../svgs/clock.svg";
import ShareNormal from "../../svgs/share-normal.svg";
import ShareApple from "../../svgs/share-apple.svg";

import Spinner from "../../svgs/spinner.svg";

function appleChecker() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
      "MacIntel",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

const shareLink = (title, text, url) => {
  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: text,
        url: url,
      })
      .catch((error) => {
        console.error("Share error: ", error);
      });
  }
};

const getRouteDetails = (id, arr) => {
  // console.log(id);
  // console.log(arr);
  const match = arr.find((e) => e.route_short_name === id);

  return match
    ? { color: "#" + match.route_color, type: match.type }
    : { color: "currentColor", type: "school" };
};

export default function BusInfo({ previousPages, isDark }) {
  const [canShare, setCanShare] = useState();

  useEffect(() => {
    if (navigator.share) {
      setCanShare(true);
    }
  }, []);

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

  const service_id = tripUpdate?.trip_update?.trip.trip_id.split("__")[0];

  const route = routes?.find((e) => e.route_short_name === service_id);

  const routeDetails = route && getRouteDetails(route.route_short_name, routes);

  let delayMinutes = Math.round(
    tripUpdate?.trip_update?.stop_time_update.arrival.delay / 60
  );

  if (!vehiclePosition || !tripUpdate)
    return (
      <div className="place-items-center grid w-9 h-9 ml-6 mt-4">
        <Spinner
          width="24"
          height="24"
          className="text-green-500 animate-spin"
        />
      </div>
    );

  if (vehicle_id === undefined || tripUpdate.message)
    return (
      <div className="px-5">
        <Head>
          <meta name="robots" content="noindex" />
          <title key="title">Catchy - Waiting for a train</title>

          <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
          <meta
            name="twitter:text:description"
            content="Updates unavailable"
            key="twitterDescription"
          />

          <meta
            property="og:title"
            content="Catchy - Waiting for a train"
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
              previousPages.length > 1 ? router.back() : router.push("/trains")
            }
            className="titleBarButton"
          >
            <CloseCross width="24" height="24" title="Back." />
          </button>
        </div>
        <h1 className="text-3xl font-semibold mb-4">Waiting for a train</h1>

        <p className="mb-4">
          Updates are either unavailable for this train, or no train has been
          assigned to your trip yet.
        </p>
        <p>Try again closer to departure time.</p>
      </div>
    );

  return (
    <div>
      <Head>
        <meta name="robots" content="noindex" />
        <title key="title">Catchy - Live train updates</title>

        <meta name="twitter:text:title" content="Catchy" key="twitterTitle" />
        <meta
          name="twitter:text:description"
          content="Live updates for a train"
          key="twitterDescription"
        />

        <meta
          property="og:title"
          content="Catchy – Live train updates"
          key="ogTitle"
        />
        <meta
          name="description"
          content="Live updates for a train"
          key="description"
        />
      </Head>
      <div className="z-10 absolute bg-gradient-to-b from-white dark:from-gray-800 left-0 mx-auto w-full h-3/5 max-h-96 pointer-events-none">
        <div className="max-w-xl mx-auto px-5 pointer-events-auto">
          <div className="mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10 ">
            <button
              onClick={() =>
                previousPages.length > 1
                  ? router.back()
                  : router.push("/trains")
              }
              className="titleBarButton"
            >
              <CloseCross width="24" height="24" title="Back." />
            </button>
            {canShare && (
              <button
                onClick={() =>
                  shareLink(
                    service_id + " Line | Catchy",
                    tripUpdate?.trip_update.trip.trip_id.split("__")[1] === "1"
                      ? route?.route_long_name
                      : route?.route_desc,
                    document.location.href
                  )
                }
                className="titleBarButton"
              >
                {appleChecker() ? (
                  <ShareApple width="24" height="24" title="Share." />
                ) : (
                  <ShareNormal width="24" height="24" title="Share." />
                )}
              </button>
            )}
          </div>

          <div className="flex">
            <RouteBadge
              route_color={routeDetails?.color}
              route_type={routeDetails?.type}
              service_id={service_id}
              transport_type="train"
              className="mr-3"
            />
            <h1 className="text-xl font-semibold leading-tight mb-2 pt-1">
              {tripUpdate?.trip_update.trip.trip_id.split("__")[1] === "1"
                ? route?.route_long_name
                : route?.route_desc}
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
        </div>
      </div>
      <Map
        lat={vehiclePosition?.vehicle.position.latitude}
        lng={vehiclePosition?.vehicle.position.longitude}
        bearing={vehiclePosition?.vehicle.position.bearing}
        bearingOffset={25}
        isDark={isDark}
      />
    </div>
  );
}
