import { useState } from "react";
import { useRouter } from "next/router";

import AutoSuggest from "react-autosuggest";
import useSWR from "swr";

import SearchIcon from "../svgs/search.svg";

const fetcher = (url) => fetch(url).then((res) => res.json());

const theme = {
  container: "relative mb-8",
  containerOpen: "",
  input:
    "bg-white shadow-md rounded-lg placeholder-gray-400 pl-10 pr-3 py-3 w-full ",
  inputOpen: "",
  inputFocused: "outline-none",
  suggestionsContainer: "absolute bg-white shadow-lg rounded w-full mt-1",
  suggestionsContainerOpen: "",
  suggestionsList: "",
  suggestion: "px-3 py-2",
  suggestionFirst: "",
  suggestionHighlighted: "bg-gray-200 rounded",
  sectionContainer: "",
  sectionContainerFirst: "",
  sectionTitle: "",
};

const Unused = () => <div className=" outline-none" />;

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
    <div className="relative">
      <SearchIcon
        width="24"
        height="24"
        role="display"
        className="absolute z-10 top-3 left-3"
      />
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
          placeholder: "Search stops",
          value: value,
          onChange: (_, { newValue, method }) => {
            setValue(newValue);
          },
        }}
        highlightFirstSuggestion={true}
        theme={theme}
      />
    </div>
  );
};
export default Search;
