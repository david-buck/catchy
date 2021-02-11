import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useServiceAlerts() {
  const { data, error } = useSWR(`/api/servicealerts`, {
    fetcher: fetcher,
    refreshInterval: 600000, // 10 minutes
    revalidateOnFocus: false,
  });
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
