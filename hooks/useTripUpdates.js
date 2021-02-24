import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useTripUpdates(id) {
  const { data, error } = useSWR(
    id ? `/api/tripupdates/${id}` : `/api/tripupdates`,
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
