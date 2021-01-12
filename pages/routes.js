import Link from "next/link";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function RoutesPage() {
  const { data, error } = useSWR(`/api/routes`, fetcher, {
    refreshInterval: 0,
  });

  if (error) return <div>Failed to load: {JSON.stringify(error)}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.map((element, key) => {
        return (
          <div key={key}>
            <strong>{element.route_short_name}</strong>{" "}
            {element.route_long_name}
          </div>
        );
      })}
    </div>
  );
}
