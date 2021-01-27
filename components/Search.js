import { useState } from "react";
import { useRouter } from "next/router";

import AutoSuggest from "react-autosuggest";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Search = () => {
  const router = useRouter();

  const { data: stops, isValidating, error } = useSWR(`/api/stops`, {
    fetcher: fetcher,
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    const regex = new RegExp(escapedValue, "i");

    return stops
      .filter(
        (match) => regex.test(match.stop_name) || regex.test(match.stop_id)
      )
      .slice(0, 10);
  }

  return (
    <div>
      <AutoSuggest
        suggestions={suggestions}
        onSuggestionsClearRequested={() => setSuggestions([])}
        onSuggestionsFetchRequested={({ value }) => {
          setValue(value);
          setSuggestions(getSuggestions(value));
        }}
        onSuggestionSelected={(_, { suggestion }) =>
          router.push(`/stop/${suggestion.stop_id}`)
        }
        getSuggestionValue={(suggestion) => suggestion.stop_name}
        renderSuggestion={(suggestion) => <span>{suggestion.stop_name}</span>}
        inputProps={{
          placeholder: "Search",
          value: value,
          onChange: (_, { newValue, method }) => {
            setValue(newValue);
          },
        }}
        highlightFirstSuggestion={true}
      />
    </div>
  );
};
export default Search;
