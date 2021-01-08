import useSWR from "swr";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((res) => res.json());

function timeConvert(n) {
  var hours = n / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return rhours + "h : " + rminutes + " m";
}

export default function StopPage() {
  const router = useRouter();
  const { sms } = router.query;

  const { data, error } = useSWR(`/proxy/StopDepartures/${sms}`, fetcher);

  if (error) return <div>failed to load {JSON.stringify(error)}</div>;
  if (!data) return <div>loading...</div>;

  let LastModified = new Date(data.LastModified);

  return (
    <div>
      <h1>{data.Stop.Name}</h1>
      <span>
        Last updated{" "}
        {LastModified.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </span>

      {data.Notices.map((element, key) => {
        return (
          <div style={{ border: "1px solid red", padding: 5 }}>
            {element.LineNote}
          </div>
        );
      })}

      {data.Services.map((element, key) => {
        return element.DestinationStopName !== "School Bus" ? (
          <div style={{ marginBottom: 30 }} key={key}>
            <h2>
              {element.ServiceID} {element.DestinationStopName}
            </h2>
            <p>{timeConvert(element.DisplayDepartureSeconds / 60)}</p>
            <p>{element.DepartureStatus}</p>
          </div>
        ) : null;
      })}
    </div>
  );
}
