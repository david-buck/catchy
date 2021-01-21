import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";

import Delay from "../../components/Delay";

import Chair from "../../svgs/chair.svg";

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
    <div className="flex justify-between mb-6">
      <div
        style={
          (type === "frequent" && { background: color, color: "white" }) ||
          (type === "standard" && { border: "1px solid ", color: color })
        }
        className="font-bold rounded-full w-10 h-10 place-items-center grid"
      >
        {service_id}
      </div>{" "}
      <h2>
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
            <>{Math.round(seconds / 60)}m</>
          )
        ) : (
          <>
            Sched:
            {new Date(aimed).toLocaleString("en-NZ", {
              hour: "numeric",
              minute: "numeric",
            })}
          </>
        )}
      </p>
      <Delay delay={delay} status={status} />
    </div>
  );
};

export default function StopPage() {
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date(time.setSeconds(time.getSeconds() + 1)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const router = useRouter();
  const { sms } = router.query;

  const { data: departures, isValidating, error } = useSWR(
    sms ? `/proxy/stopdepartures/${sms}` : null,
    {
      fetcher: fetcher,
      refreshInterval: 30000,
    }
  );
  const { data: stop } = useSWR(sms ? `/proxy/stops/${sms}` : null, {
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
    revalidateOnFocus: false,
  });

  const [time, setTime] = useState(
    date !== undefined ? new Date(date.date) : new Date()
  );

  if (error)
    return stop ? (
      <div>
        Unable to get realtime updates for {stop.stop_name}. Try again later
      </div>
    ) : (
      <div>Unable to get realtime updates for stop {sms}. Try again later</div>
    );

  if (!departures || !stop || !routes) return <div>Loading...</div>;

  return (
    <div>
      <Head>
        <link
          rel="preload"
          href="/api/routes"
          as="fetch"
          crossorigin="anonymous"
        ></link>
      </Head>
      <Link href="/">
        <a>Back</a>
      </Link>
      <h1 className="text-4xl font-bold mb-6">{stop.stop_name}</h1>
      {time.toString()}

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
      {isValidating && <div className="absolute top-4 left-4">Refreshing</div>}
    </div>
  );
}
