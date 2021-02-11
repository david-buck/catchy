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

import routeNamer from "../../lib/routeNamer";

import BackArrow from "../../svgs/navigation-left-arrow.svg";
import LocationMarker from "../../svgs/location-mono.svg";
import Chair from "../../svgs/chair.svg";

import Spinner from "../../svgs/spinner.svg";

const fetcher = (url) => fetch(url).then((res) => res.json());

const getRouteDetails = (id, arr) => {
  const match = arr.find((element) => element.route_short_name === id);

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

const Expected = ({
  service_id,
  destination_name,
  school,
  expected,
  aimed,
  time,
  status,
  wheelchair_accessible,
  color,
  type,
  delay,
  vehicle_id,
}) => {
  let seconds = (Date.parse(expected) - Date.parse(time)) / 1000;

  return (
    <Link
      as={vehicle_id ? `/trip/${vehicle_id}` : null}
      href={vehicle_id ? "/trip/[vehicle_id]" : "/trip/undefined"}
    >
      <a className="grid grid-cols-stop-row gap-x-3 py-3 items-center text-lg">
        <div
          style={
            (type === "frequent" && {
              background: color,
              color: "white",
            }) ||
            (type === "standard" && {
              background: "white",
              border: "1px solid ",
              color: color,
            }) ||
            (type === "night" && {
              background: "rgba(0,0,0,0.8)",
              boxShadow: "-.5rem 0 0 0 inset currentColor",
              color: "#FFF200",
              fontSize: "0.875rem ",
              letterSpacing: "-0.05em",
              paddingRight: ".5rem",
            }) ||
            (type === "school" && {
              background: "#FAFF00",
              color: "rgba(0,0,0,.8)",
            })
          }
          className="grid place-items-center w-9 h-9 font-semibold rounded-full"
        >
          {service_id}
        </div>
        <h3 className="leading-none">
          {routeNamer(destination_name)}
          {school && (
            <span className="text-sm opacity-60 leading-none">
              <br />
              {school}
            </span>
          )}
        </h3>
        <div>
          {wheelchair_accessible && (
            <Chair
              width="18"
              height="18"
              title="Wheelchair accessible."
              className="opacity-60"
            />
          )}
        </div>
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
    </Link>
  );
};

export default function StopPage() {
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
    onSuccess: (date) => {
      let offset = Date.parse(date.date) - Date.parse(time);
      setDateOffset(offset > 10000 ? offset : 0);
    },
  });

  if (error)
    return stop ? (
      <div>
        Unable to get realtime updates for {stop.stop_name}. Try again later
      </div>
    ) : (
      <div>Unable to get realtime updates for stop {sms}. Try again later</div>
    );

  if (!departures || !stop || !routes || !school_routes)
    return <Spinner width="24" height="24" className="mt-2 text-yellow-500" />;

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
      <div className="bg-white dark:bg-gray-800 mb-2 pb-2 pt-4 flex row justify-between sticky top-0 z-10">
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
          <FavouriteButton sms={sms} />
        </div>
      </div>
      <h1 className="text-3xl font-semibold">{stop.stop_name}</h1>

      {/* {relevantAlerts.length > 0 &&
        relevantAlerts.map((e, k) => e.alert.header_text.translation[0].text)} */}

      {departures.departures.length > 0 ? (
        <div>
          {groupedDepartures?.map(([date, departures]) => {
            let loopDate = new Date(date);
            return (
              <React.Fragment key={date}>
                <h2 className="col-span-4 pt-4 mb-2 bg-white dark:bg-gray-800 sticky top-11 z-10">
                  {loopDate.getDate() === new Date().getDate() && (
                    <span className="font-bold mr-1">Today </span>
                  )}
                  {loopDate.getDate() === new Date().getDate() + 1 && (
                    <span className="font-bold mr-1">Tomorrow </span>
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
                      color={routeDetails.color}
                      type={routeDetails.type}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div className="text-lg opacity-60">
          No buses currently scheduled for this stop.
        </div>
      )}
    </div>
  );
}
