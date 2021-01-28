import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";

import Delay from "../../components/Delay";
import FavouriteButton from "../../components/FavouriteButton";

import BackArrow from "../../svgs/navigation-left-arrow.svg";
import Chair from "../../svgs/chair.svg";

import Spinner from "../../svgs/spinner.svg";

const fetcher = (url) => fetch(url).then((res) => res.json());

const getRouteDetails = (id, arr) => {
  const match = arr.find((e) => e.route_short_name === id);
  return { color: "#" + match.route_color, type: match.type };
};

const Expected = ({
  service_id,
  destination_name,
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
    <div className="flex justify-between mb-6 space-x-4 items-center">
      <div
        style={
          (type === "frequent" && { background: color, color: "white" }) ||
          (type === "standard" && {
            background: "white",
            border: "1px solid ",
            color: color,
          }) ||
          (type === "night" && {
            background: "black",
            boxShadow: "-.5rem 0 0 0 inset currentColor",
            color: "#fff200",
            fontSize: "0.75rem ",
            letterSpacing: "-0.075em",
            paddingRight: ".5rem",
          })
        }
        className="font-bold rounded-full w-10 h-10 place-items-center grid"
      >
        {service_id}
      </div>{" "}
      <h2 className="flex-1 font-bold">
        {destination_name}{" "}
        {wheelchair_accessible && (
          <Chair
            width="16"
            height="16"
            title="Wheelchair accessible."
            style={{ display: "inline" }}
          />
        )}
      </h2>
      <p>
        {expected ? (
          seconds < 70 ? (
            <>Due</>
          ) : (
            <>{Math.round(seconds / 60)} mins</>
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
      </p>
      {/* <Delay delay={delay} status={status} /> */}
    </div>
  );
};

export default function StopPage() {
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date(Date.parse(new Date()) + dateOffset));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const router = useRouter();
  const { sms } = router.query;

  const { data: departures, isValidating, error } = useSWR(
    sms ? `/proxy/stopdepartures/${sms}` : null,
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

  const { data: date } = useSWR(`/api/local-time`, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: false,
    onSuccess: () => setDateOffset(Date.parse(date.date) - Date.parse(time)),
  });

  const [time, setTime] = useState(new Date());
  const [dateOffset, setDateOffset] = useState(0);

  if (error)
    return stop ? (
      <div>
        Unable to get realtime updates for {stop.stop_name}. Try again later
      </div>
    ) : (
      <div>Unable to get realtime updates for stop {sms}. Try again later</div>
    );

  if (!departures || !stop || !routes)
    return <Spinner width="24" height="24" className="mt-2" />;

  return (
    <div className="relative pt-2">
      <Head>
        <link
          rel="preload"
          href="/api/routes"
          as="fetch"
          crossorigin="anonymous"
        />
      </Head>
      <div className="mb-6 flex row justify-between">
        <Link href="/">
          <a>
            <BackArrow width="24" />
          </a>
        </Link>
        <div className="flex">
          {isValidating && <Spinner width="24" height="24" className="mr-4" />}
          <FavouriteButton sms={sms} />
        </div>
      </div>
      <h1 className="text-3xl font-semibold mb-2">{stop.stop_name}</h1>
      <div className="mb-8">
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
      {departures.departures.map((element, key) => {
        let routeDetails = getRouteDetails(element.service_id, routes);

        return element.destination.name !== "School Bus" ? (
          <Expected
            service_id={element.service_id}
            destination_name={element.destination.name}
            expected={element.arrival.expected}
            aimed={
              element.arrival.aimed !== ""
                ? element.arrival.aimed
                : element.departure.aimed
            }
            time={time}
            status={element.status}
            delay={element.delay}
            key={key}
            wheelchair_accessible={element.wheelchair_accessible}
            color={routeDetails.color}
            type={routeDetails.type}
          />
        ) : null;
      })}
    </div>
  );
}
