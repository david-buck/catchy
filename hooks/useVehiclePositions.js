import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useVehiclePositions(id) {
  const { data, error } = useSWR(
    id ? `/api/vehiclepositions/${id}` : `/api/vehiclepositions`,
    {
      fetcher: fetcher,
      refreshInterval: 10000, // 10 seconds
      revalidateOnFocus: true,
    }
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
