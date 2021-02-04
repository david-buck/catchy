import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";

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

const Expected = ({
  service_id,
  destination_name,
  school,
  expected,
  aimed,
  time,
  delay,
  status,
  wheelchair_accessible,
  color,
  type,
}) => {
  let seconds = (Date.parse(expected) - Date.parse(time)) / 1000;

  return (
    <div
      className="flex justify-between py-3 space-x-3
     items-center"
    >
      <div
        style={
          (type === "frequent" && { background: color, color: "white" }) ||
          (type === "standard" && {
            background: "white",
            border: "1px solid ",
            color: color,
          }) ||
          (type === "night" && {
            background: "rgba(0,0,0,0.8)",
            boxShadow: "-.5rem 0 0 0 inset currentColor",
            color: "#fff200",
            fontSize: "0.75rem ",
            letterSpacing: "-0.075em",
            paddingRight: ".5rem",
          }) ||
          (type === "school" && {
            background: "#FAFF00",

            color: "rgba(0,0,0,.8)",
          })
        }
        className="font-semibold rounded-full w-9 h-9 place-items-center grid"
      >
        {service_id}
      </div>{" "}
      <h2 className="flex-1 leading-tight">
        {routeNamer(destination_name)}
        {school && (
          <span className="text-sm opacity-60 leading-tight">
            <br />
            {school}
          </span>
        )}
        {wheelchair_accessible && (
          <Chair
            width="16"
            height="16"
            title="Wheelchair accessible."
            className="inline ml-2 opacity-60"
          />
        )}
      </h2>
      {wheelchair_accessible && (
        <Chair
          width="16"
          height="16"
          title="Wheelchair accessible."
          className="inline ml-2 opacity-60"
        />
      )}
      <p>
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
            {new Date(aimed).toLocaleTimeString("en-NZ", {
              hour: "numeric",
              minute: "numeric",
              hour12: "true",
            })}
          </>
        )}
        {status === "cancelled" && (
          <span className="font-bold text-red-500"> Cancelled</span>
        )}
      </p>
    </div>
  );
};

export default function StopPage() {
  const [time, setTime] = useState(new Date());
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
  const { data: stop } = useSWR(sms ? `/api/stop/${sms}` : null, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  const { data: routes } = useSWR(sms ? `/api/routes` : null, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  const { data: school_routes } = useSWR(sms ? `/api/routes/school` : null, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

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
    return <Spinner width="24" height="24" className="mt-2 text-gray-500" />;

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
      <div className="mb-4 flex row justify-between">
        <Link href="/">
          <a className="titleBarButton">
            <BackArrow width="24" height="24" title="Back." />
          </a>
        </Link>
        <div className="flex space-x-1">
          {isValidating && (
            <div className="place-items-center grid w-9 h-9 mr-1">
              <Spinner width="22" height="22" className="text-gray-500" />
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
      <h1 className="text-3xl font-semibold mb-2">{stop.stop_name}</h1>
      <div className="mb-4">
        {time.toLocaleString("en-NZ", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
      </div>
      {departures.alerts.map((element, key) => {
        return (
          <div style={{ border: "1px solid red", padding: 5 }} key={key}>
            {element.alert}
          </div>
        );
      })}
      {departures.departures.length > 0 ? (
        departures.departures.map((element, key) => {
          let routeDetails = getRouteDetails(element.service_id, routes);

          return (
            <Expected
              service_id={element.service_id}
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
              key={key}
              wheelchair_accessible={element.wheelchair_accessible}
              color={routeDetails.color}
              type={routeDetails.type}
            />
          );
        })
      ) : (
        <div className="opacity-60">
          No buses currently scheduled for this stop.
        </div>
      )}
    </div>
  );
}
