import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useTripUpdates() {
  const { data, error } = useSWR(`/api/tripupdates`, {
    fetcher: fetcher,
    refreshInterval: 20000, // 20 seconds
    revalidateOnFocus: false,
  });
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
