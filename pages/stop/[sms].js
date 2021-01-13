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
}) => {
  let seconds = (Date.parse(expected) - Date.parse(time)) / 1000;

  return (
    <div className="flex justify-between mb-6">
      <h2>
        {service_id} {destination_name}
      </h2>
      <p>
        {expected !== "" ? (
          seconds < 70 ? (
            <>Due</>
          ) : (
            <>{Math.round(seconds / 60)}m</>
          )
        ) : (
          <>
            {new Date(aimed).toLocaleString("en-US", {
              //  weekday: "long",
              //  year: "numeric",
              //  month: "long",
              //  day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </>
        )}
      </p>
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

  if (error)
    return stop ? (
      <div>
        Unable to get realtime updates for {stop.stop_name}. Try again later
      </div>
    ) : (
      <div>Unable to get realtime updates for stop {sms}. Try again later</div>
    );

  if (!departures || !stop) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">{stop.stop_name}</h1>
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
      {isValidating && <div className="absolute top-4 left-4">Refreshing</div>}
    </div>
  );
}
