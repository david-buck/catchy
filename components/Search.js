import { useState } from "react";
import { useRouter } from "next/router";

import AutoSuggest from "react-autosuggest";

import useStops from "../hooks/useStops";

import SearchIcon from "../svgs/search.svg";
import LocationMarker from "../svgs/location-mono.svg";

const theme = {
  container: "relative mt-2 mb-6",
  containerOpen: "",
  input:
    "transition bg-white shadow-md focus:shadow-lg dark:bg-gray-800 rounded-lg placeholder-gray-400 pl-10 pr-3 py-3 w-full border-gray-100 dark:border-gray-500 border border-solid ",
  inputOpen: "",
  inputFocused: "outline-none",
  suggestionsContainer: "overflow-y-auto max-h-suggestions-container",
  suggestionsContainerOpen:
    "absolute bg-white dark:bg-gray-800 shadow-lg rounded w-full mt-1 border-gray-100 dark:border-gray-500 border border-solid z-10",
  suggestionsList: "",
  suggestion: "pr-3 py-4",
  suggestionFirst: "",
  suggestionHighlighted: "bg-gray-100 dark:bg-gray-700",
  sectionContainer: "",
  sectionContainerFirst: "",
  sectionTitle: "",
};

const Search = () => {
  const router = useRouter();

  const { data: stops, isValidating, error } = useStops();

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    return stops
      .filter(
        (match) =>
          escapedValue
            .split(/\W/)
            .every((val) =>
              new RegExp("\\b" + val, "i").test(match.stop_name)
            ) || new RegExp("^" + escapedValue).test(match.stop_id)
      )
      .slice(0, 20);
  }

  return (
    <div className="relative text-lg px-5">
      <SearchIcon
        width="24"
        height="24"
        role="display"
        className="absolute z-10 top-5.5 left-8"
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
        renderSuggestion={(suggestion, value) => (
          <span className="flex flex-nowrap items-top">
            <LocationMarker
              width="38"
              height="18"
              className="text-gray-300 flex-shrink-0 mt-1 ml-0.5"
            />
            <span>
              {suggestion.stop_name}{" "}
              {suggestion.stop_id.includes(value.query) && (
                <span className="text-sm opacity-60 leading-none">
                  <br />
                  Stop {suggestion.stop_id}
                </span>
              )}
            </span>
          </span>
        )}
        inputProps={{
          placeholder: "Search stops by name or stop #",
          value: value,
          onChange: (_, { newValue, method }) => {
            setValue(newValue);
          },
          autoCorrect: "off",
          autoCapitalize: "off",
          spellCheck: "false",
        }}
        highlightFirstSuggestion={true}
        theme={theme}
      />
    </div>
  );
};
export default Search;
