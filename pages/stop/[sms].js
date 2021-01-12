import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Expected = ({
  service_id,
  destination_name,
  expected,
  aimed,
  time,
  status,
  key,
}) => {
  let seconds = (Date.parse(expected) - Date.parse(time)) / 1000;
  return (
    <div style={{ marginBottom: 30 }} key={key}>
      <h2>
        {service_id} {destination_name}
      </h2>
      <p>
        {expected !== "" ? (
          seconds < 90 ? (
            <>Due</>
          ) : (
            <>{Math.round(seconds / 60)}m</>
          )
        ) : (
          <>
            {new Date(aimed).toLocaleString("en-US", {
              // weekday: "long",
              // year: "numeric",
              // month: "long",
              // day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </>
        )}
      </p>

      {status && <p>{status}</p>}
    </div>
  );
};

export default function StopPage() {
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [time, setTime] = useState(new Date());

  const router = useRouter();
  const { sms } = router.query;

  const { data: departures } = useSWR(`/proxy/stopdepartures/${sms}`, {
    fetcher: fetcher,
    refreshInterval: 30000,
  });
  const { data: stop } = useSWR(`/proxy/stops/${sms}`, {
    fetcher: fetcher,
    refreshInterval: 0,
  });

  if (!departures || !stop) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{stop.stop_name}</h1>
      {/* {time.toString()} */}

      {departures.alerts.map((element, key) => {
        return (
          <div style={{ border: "1px solid red", padding: 5 }} key={key}>
            {element.alert}
          </div>
        );
      })}

      {departures.departures.map((element, key) => {
        return element.destination.name !== "School Bus" ? (
          <Expected
            service_id={element.service_id}
            destination_name={element.destination.name}
            expected={element.arrival.expected}
            aimed={element.arrival.aimed}
            time={time}
            status={element.status}
            key={key}
          />
        ) : null;
      })}
    </div>
  );
}
