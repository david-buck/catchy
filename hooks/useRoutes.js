import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useRoutes() {
  const { data, error } = useSWR(`/api/routes`, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: false,
  });
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
