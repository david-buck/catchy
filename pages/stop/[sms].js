import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";

import useRoutes from "../../hooks/useRoutes";
import useSchoolRoutes from "../../hooks/useSchoolRoutes";
import useServiceAlerts from "../../hooks/useServiceAlerts";

import FavouriteButton from "../../components/FavouriteButton";
import RouteBadge from "../../components/RouteBadge";

import routeNamer from "../../lib/routeNamer";
import checkStopType from "../../lib/checkStopType";

import BackArrow from "../../svgs/navigation-left-arrow.svg";
import Chair from "../../svgs/chair.svg";
import LocationMarker from "../../svgs/location-mono.svg";

import Spinner from "../../svgs/spinner.svg";

const oneDirectionStops = [
  "JOHN",
  "MAST",
  "MELL",
  "WAIK",
  "WELL",
  "KELB",
  "LAMB",
  "9997",
  "9999",
];

const backLinks = {
  bus: "/",
  train: "/trains",
  cableCar: "/cable-car",
  ferry: "/ferry",
};

const segmentedButtonLabels = {
  train: { all: "Both ways", inbound: "Inbound", outbound: "Outbound" },
  cableCar: { all: "Both ways", inbound: "Down", outbound: "Up" },
  ferry: { all: "Both ways", inbound: "To city", outbound: "To Days Bay" },
};

const fetcher = (url) => fetch(url).then((res) => res.json());

const getRouteDetails = (id, arr) => {
  const match = arr.find((el) => el.route_short_name === id);

  return match
    ? { color: "#" + match.route_color, type: match.type }
    : { color: "currentColor", type: "school" };
};

const groupByDepartureDate = (objectArray, dateProperty) => {
  return objectArray.reduce((acc, obj) => {
    let key = new Date(obj.departure[dateProperty]).toLocaleDateString(
      "en-NZ",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

const PageWrapper = ({ children, stop }) => (
  <div className="relative">
    <Head>
      <title key="title">{stop?.stop_name} bus stop — Catchy</title>

      <meta
        name="twitter:text:title"
        content={`${stop?.stop_name} — Catchy`}
        key="twitterTitle"
      />
      <meta
        name="twitter:text:description"
        content={`Bus departures updates for ${stop?.stop_name}`}
        key="twitterDescription"
      />

      <meta
        property="og:title"
        content={`${stop?.stop_name} — Catchy`}
        key="ogTitle"
      />
      <meta
        name="description"
        content={`Bus departures updates for ${stop?.stop_name}`}
        key="description"
      />
    </Head>
    {children}
  </div>
);

const ViewUpdatesLink = ({
  cancelled,
  unknown,
  vehicle_id,
  stopType,
  children,
}) => {
  if (stopType === "cableCar" || stopType === "ferry") {
    return <div className="pointer-events-none">{children}</div>;
  } else if (cancelled) {
    return <Link href={`/${stopType}/cancelled`}>{children}</Link>;
  } else if (unknown) {
    return <Link href={`/${stopType}/unknown`}>{children}</Link>;
  } else if (vehicle_id) {
    return (
      <Link
        as={`/${stopType}/${vehicle_id}`}
        href={`/${stopType}/[vehicle_id]`}
      >
        {children}
      </Link>
    );
  }
};

const Expected = ({
  aimed,
  destination_name,
  expected,
  route_color,
  route_type,
  school,
  service_id,
  status,
  stopType,
  time,
  vehicle_id,
  wheelchair_accessible,
}) => {
  let seconds = (Date.parse(expected) - Date.parse(time)) / 1000;

  return (
    <ViewUpdatesLink
      cancelled={status === "cancelled"}
      unknown={!vehicle_id}
      vehicle_id={vehicle_id}
      stopType={stopType}
    >
      <a className="grid grid-cols-stop-row gap-x-3 px-5 py-3 items-center text-lg hover:bg-gray-400 hover:bg-opacity-10 rounded-lg">
        <RouteBadge
          route_color={route_color}
          route_type={route_type}
          service_id={service_id}
          transport_type={stopType}
        />

        <h3
          className={`leading-none ${!wheelchair_accessible && "col-span-2"}`}
        >
          {routeNamer(destination_name)}
          {school && (
            <span className="text-sm opacity-60 leading-none">
              <br />
              {school}
            </span>
          )}
        </h3>
        {!!wheelchair_accessible && (
          <div>
            <Chair
              width="13"
              height="16"
              title="Wheelchair accessible."
              className="opacity-60"
            />
          </div>
        )}
        <div className="text-right leading-tight">
          {expected ? (
            seconds < 90 ? (
              <span className="font-bold">Due</span>
            ) : (
              <>
                {Math.round(seconds / 60)} min
                {Math.round(seconds / 60) > 1 && <>s</>}
              </>
            )
          ) : (
            <>
              {new Date(aimed)
                .toLocaleTimeString("en-NZ", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })
                .replace(" 0:", " 12:")}
            </>
          )}
          {status === "cancelled" && (
            <span className="font-bold text-red-500">
              <br />
              Cancelled
            </span>
          )}
        </div>
      </a>
    </ViewUpdatesLink>
  );
};

const Alert = ({
  active_period,
  effect,
  severity_level,
  header_text,
  description_text,
}) => {
  const epochNow = parseInt(Date.parse(new Date()) / 1000);

  return (
    active_period[0].start < epochNow &&
    active_period[0].end > epochNow &&
    effect !== "NO_EFFECT" &&
    severity_level === "WARNING" && (
      <div className="bg-pink-50 border-pink-500 dark:bg-pink-700 dark:border-pink-800 px-4 py-3 border-2 rounded-md mx-5 mt-4 mb-2">
        <h2 className="text-lg font-bold leading-tight mb-2">{header_text}</h2>
        <p>{description_text}</p>
      </div>
    )
  );
};

const SegmentedButton = ({ label, direction, setDirection, directionTo }) => (
  <button
    onClick={() => setDirection(directionTo)}
    className={` flex-grow p-1  hover:bg-gray-100  dark:hover:bg-gray-700 rounded-full focus-visible:ring focus:outline-none " ${
      direction === directionTo
        ? "font-bold bg-gray-100 dark:bg-gray-700 rounded-full border  -z-10 shadow-sm"
        : "font-regular"
    }`}
  >
    {label}
  </button>
);

export default function StopPage({
  favourites,
  setFavourites,
  bus_stops,
  train_stations,
  cable_car_stops,
  ferry_stops,
}) {
  const router = useRouter();
  const { sms } = router.query;

  const stopType = checkStopType(sms);

  const stopSources = {
    bus: bus_stops,
    train: train_stations,
    cableCar: cable_car_stops,
    ferry: ferry_stops,
  };

  const stops = stopSources[stopType];

  const stop = stops?.find((el) => el.stop_id === sms);

  const [time, setTime] = useState(new Date());
  const [groupedDepartures, setGroupedDepartures] = useState(null);
  const [dateOffset, setDateOffset] = useState(0);
  const [direction, setDirection] = useState("");

  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date(Date.parse(new Date()) + dateOffset));
    }, 1000);
    return () => {
      clearInterval(interval);
      setCancelled(true);
    };
  }, [dateOffset]);

  const bigTitle = useRef(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    var intersectionObserver = new IntersectionObserver(
      function (entries) {
        setTitleVisible(!entries[0].isIntersecting);
      },
      { rootMargin: "-65px 0px 0px 0px", threshold: 0.1 }
    );

    bigTitle?.current && intersectionObserver.observe(bigTitle.current);
  }, [bigTitle.current]);

  const { data: departures, isValidating, error } = useSWR(
    sms && !cancelled ? `/proxy/stopdepartures/${sms}` : null,
    {
      fetcher: fetcher,
      refreshInterval: 20000,
    }
  );

  useEffect(() => {
    departures != null &&
      departures !== undefined &&
      !departures?.error &&
      setGroupedDepartures(
        Object.entries(groupByDepartureDate(departures?.departures, "aimed"))
      );
  }, [departures]);

  const { data: routes } = useRoutes();

  const { data: school_routes } = useSchoolRoutes();

  const { data: service_alerts } = useServiceAlerts(sms);

  const { data } = useSWR(`/api/local-time`, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: true,
    onSuccess: (d) => {
      let offset = Date.parse(d.date) - Date.parse(time);
      setDateOffset(offset > 10000 ? offset : 0);
    },
  });

  if (error) {
    return (
      <PageWrapper stop={stop}>
        {stop ? (
          <div className="px-5">
            Unable to get realtime updates for {stop.stop_name}. Try again later
          </div>
        ) : (
          <div className="px-5">
            Unable to get realtime updates for stop {sms}. Try again later
          </div>
        )}
      </PageWrapper>
    );
  }

  if (!stop || !departures || !routes || (!school_routes && stopType === "bus"))
    return (
      <Spinner width="24" height="24" className="text-yellow-500 mt-6 ml-5" />
    );

  return stop ? (
    <PageWrapper stop={stop}>
      <div className="bg-white dark:bg-gray-800 mb-2 px-5 pb-2 pt-4 flex row justify-between sticky top-0 z-20">
        <Link href={backLinks[stopType]}>
          <a className="titleBarButton">
            <BackArrow width="24" height="24" title="Back." />
          </a>
        </Link>
        <div
          className={`px-2 py-1 text-xl font-semibold flex-1 overflow-ellipsis line-clamp-1  transition-opacity ${
            titleVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {stop.stop_name}
        </div>
        <div className="flex space-x-1">
          {isValidating && (
            <div className="place-items-center grid w-9 h-9 mr-1">
              <Spinner width="22" height="22" className="text-yellow-500" />
            </div>
          )}
          <a
            href={`https://maps.google.com/?q=${encodeURI(stop.stop_name)}&ll=${
              stop.stop_lat
            },${stop.stop_lon}&z=19`}
            target="_blank"
            className="titleBarButton"
          >
            <LocationMarker width="20" height="20" title="View on map." />
          </a>
          {(stopType === "bus" || stopType === "train") && (
            <FavouriteButton
              sms={sms}
              favourites={favourites}
              setFavourites={setFavourites}
            />
          )}
        </div>
      </div>
      <h1 className="text-3xl font-semibold px-5" ref={bigTitle}>
        {stop.stop_name}
      </h1>

      {service_alerts?.length > 0 &&
        service_alerts.map((e, k) => (
          <Alert
            active_period={e.alert.active_period}
            effect={e.effect}
            severity_level={e.alert.severity_level}
            header_text={e.alert.header_text.translation[0].text}
            description_text={e.alert.description_text.translation[0].text}
            key={k}
          />
        ))}

      {departures.departures.length > 0 ? (
        <div>
          {stopType !== "bus" && !oneDirectionStops.includes(sms) && (
            <div>
              <h2 className="hidden">Trip direction</h2>
              <nav className="mx-5 mt-6 mb-2 text-lg rounded-full bg-gray-50 dark:bg-gray-900 flex">
                <SegmentedButton
                  label={segmentedButtonLabels[stopType].all}
                  directionTo=""
                  direction={direction}
                  setDirection={setDirection}
                />
                <SegmentedButton
                  label={segmentedButtonLabels[stopType].inbound}
                  directionTo="inbound"
                  direction={direction}
                  setDirection={setDirection}
                />
                <SegmentedButton
                  label={segmentedButtonLabels[stopType].outbound}
                  directionTo="outbound"
                  direction={direction}
                  setDirection={setDirection}
                />
              </nav>
            </div>
          )}

          {groupedDepartures?.map(([date, departures]) => {
            let loopDate = new Date(date);
            return (
              <div key={date}>
                <h2 className="col-span-4 px-5 pt-4 mb-2 bg-white dark:bg-gray-800 sticky top-12 z-10">
                  {loopDate.getDate() === new Date().getDate() ? (
                    <span className="font-bold mr-1">Today </span>
                  ) : (
                    <>
                      <span className="font-bold mr-1">Tomorrow </span>
                    </>
                  )}
                  <span className="opacity-60">
                    {loopDate.toLocaleString("en-NZ", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </h2>

                {departures.filter((el) =>
                  direction !== "" ? el.direction === direction : el
                ).length > 0 ? (
                  departures
                    .filter((el) =>
                      direction !== "" ? el.direction === direction : el
                    )
                    .map((element, key) => {
                      let routeDetails = getRouteDetails(
                        element.service_id,
                        routes
                      );
                      return (
                        <Expected
                          key={date + key}
                          service_id={element.service_id}
                          vehicle_id={element.vehicle_id}
                          destination_name={element.destination.name}
                          school={
                            stopType === "bus" &&
                            routeDetails.type === "school" &&
                            school_routes.find(
                              (el) => el.route_short_name === element.service_id
                            ).schools
                          }
                          expected={element.departure.expected}
                          aimed={element.departure.aimed}
                          time={time}
                          status={element.status}
                          stopType={stopType}
                          delay={element.delay}
                          wheelchair_accessible={element.wheelchair_accessible}
                          route_color={routeDetails.color}
                          route_type={routeDetails.type}
                        />
                      );
                    })
                ) : (
                  <div className="px-5 pt-4 text-lg opacity-60">
                    There are no trips scheduled for this stop in this
                    direction.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-lg opacity-60 pt-4 px-5">
          No trips currently scheduled for this stop.
        </div>
      )}
    </PageWrapper>
  ) : null;
}
