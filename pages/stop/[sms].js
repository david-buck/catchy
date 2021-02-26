import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";

import useRoutes from "../../hooks/useRoutes";
import useSchoolRoutes from "../../hooks/useSchoolRoutes";
import useStops from "../../hooks/useStops";
import useServiceAlerts from "../../hooks/useServiceAlerts";

import FavouriteButton from "../../components/FavouriteButton";
import RouteBadge from "../../components/RouteBadge";

import routeNamer from "../../lib/routeNamer";

import BackArrow from "../../svgs/navigation-left-arrow.svg";
import BusStopMarker from "../../svgs/bus-stop-mono.svg";
import Chair from "../../svgs/chair.svg";
import LocationMarker from "../../svgs/location-mono.svg";

import Spinner from "../../svgs/spinner.svg";

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

const BusLink = ({ cancelled, unknown, vehicle_id, children }) => {
  if (cancelled) {
    return <Link href="/bus/cancelled">{children}</Link>;
  } else if (unknown) {
    return <Link href="/bus/unknown">{children}</Link>;
  } else if (vehicle_id) {
    return (
      <Link as={`/bus/${vehicle_id}`} href={"/bus/[vehicle_id]"}>
        {children}
      </Link>
    );
  }
};

const Expected = ({
  service_id,
  destination_name,
  school,
  expected,
  aimed,
  time,
  status,
  wheelchair_accessible,
  route_color,
  route_type,
  vehicle_id,
}) => {
  let seconds = (Date.parse(expected) - Date.parse(time)) / 1000;

  return (
    <BusLink
      cancelled={status === "cancelled"}
      unknown={!vehicle_id}
      vehicle_id={vehicle_id}
    >
      <a className="grid grid-cols-stop-row gap-x-3 px-5 py-3 items-center text-lg hover:bg-gray-400 hover:bg-opacity-10 rounded-lg">
        <RouteBadge
          route_color={route_color}
          route_type={route_type}
          service_id={service_id}
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
        {wheelchair_accessible && (
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
    </BusLink>
  );
};

const Alert = ({
  active_period,
  effect,
  severity_level,
  header_text,
  description_text,
  key,
}) => {
  const epochNow = parseInt(Date.parse(new Date()) / 1000);

  return active_period[0].start < epochNow &&
    active_period[0].end > epochNow &&
    effect !== "NO_EFFECT" ? (
    <div
      key={key}
      className={`${
        severity_level === "WARNING"
          ? "bg-pink-50 border-pink-500 dark:bg-pink-700 dark:border-pink-800"
          : "bg-blue-50 border-blue-500 dark:bg-blue-700 dark:border-blue-800"
      } px-4 py-3 border-2 rounded-md mx-5 mt-4 mb-2`}
    >
      <h2 className="text-lg font-bold leading-tight mb-2">{header_text}</h2>
      <p>{description_text}</p>
    </div>
  ) : (
    <div key={key} />
  );
};

export default function StopPage({ favourites, setFavourites }) {
  const [time, setTime] = useState(new Date());
  const [groupedDepartures, setGroupedDepartures] = useState(null);
  const [dateOffset, setDateOffset] = useState(0);

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

  const router = useRouter();
  const { sms } = router.query;

  const { data: departures, isValidating, error } = useSWR(
    sms && !cancelled ? `/proxy/stopdepartures/${sms}` : null,
    {
      fetcher: fetcher,
      refreshInterval: 20000,
    }
  );

  useEffect(() => {
    departures != null &&
      setGroupedDepartures(
        Object.entries(groupByDepartureDate(departures?.departures, "aimed"))
      );
  }, [departures]);

  const { data: stops } = useStops();

  const stop = stops?.find((e) => e.stop_id === sms);

  const { data: routes } = useRoutes();

  const { data: school_routes } = useSchoolRoutes();

  const { data: service_alerts } = useServiceAlerts();

  const relevantAlerts = service_alerts?.entity.filter((e) =>
    e.alert.informed_entity.find((f) => f.stop_id === sms)
  );

  const { data: date } = useSWR(`/api/local-time`, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: false,
    onSuccess: (d) => {
      let offset = Date.parse(d.date) - Date.parse(time);
      setDateOffset(offset > 10000 ? offset : 0);
    },
  });

  if (error)
    return stop ? (
      <div className="px-5">
        Unable to get realtime updates for {stop.stop_name}. Try again later
      </div>
    ) : (
      <div className="px-5">
        Unable to get realtime updates for stop {sms}. Try again later
      </div>
    );

  if (!departures || !stop || !routes || !school_routes)
    return (
      <Spinner width="24" height="24" className="text-yellow-500 mt-6 ml-5" />
    );

  return (
    <div className="relative">
      <Head>
        <title key="title">{stop.stop_name} bus stop — Catchy</title>

        <meta
          name="twitter:text:title"
          content={`${stop.stop_name} bus stop — Catchy`}
          key="twitterTitle"
        />
        <meta
          name="twitter:text:description"
          content={`Bus departures updates for ${stop.stop_name}`}
          key="twitterDescription"
        />

        <meta
          property="og:title"
          content={`${stop.stop_name} bus stop — Catchy`}
          key="ogTitle"
        />
        <meta
          name="description"
          content={`Bus departures updates for ${stop.stop_name}`}
          key="description"
        />
      </Head>
      <div className="bg-white dark:bg-gray-800 mb-2 px-5 pb-2 pt-4 flex row justify-between sticky top-0 z-20">
        <Link href="/">
          <a className="titleBarButton">
            <BackArrow width="24" height="24" title="Back." />
          </a>
        </Link>
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
          <FavouriteButton
            sms={sms}
            favourites={favourites}
            setFavourites={setFavourites}
          />
        </div>
      </div>
      <h1 className="text-3xl font-semibold px-5">{stop.stop_name}</h1>

      {relevantAlerts?.length > 0 &&
        relevantAlerts.map((e, k) => (
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
          {groupedDepartures?.map(([date, departures]) => {
            let loopDate = new Date(date);
            return (
              <div key={date}>
                <h2 className="col-span-4 px-5 pt-4 mb-2 bg-white dark:bg-gray-800 sticky top-12 z-10">
                  {loopDate.getDate() === new Date().getDate() && (
                    <span className="font-bold mr-1">Today </span>
                  )}
                  {loopDate.getDate() === new Date().getDate() + 1 && (
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

                {departures.map((element, key) => {
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
                        routeDetails.type === "school" &&
                        school_routes.find(
                          (el) => el.route_short_name === element.service_id
                        ).schools
                      }
                      expected={element.departure.expected}
                      aimed={element.departure.aimed}
                      time={time}
                      status={element.status}
                      delay={element.delay}
                      wheelchair_accessible={element.wheelchair_accessible}
                      route_color={routeDetails.color}
                      route_type={routeDetails.type}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-lg opacity-60 pt-4">
          No buses currently scheduled for this stop.
        </div>
      )}
    </div>
  );
}
