import { useState } from "react";
import { useRouter } from "next/router";

import AutoSuggest from "react-autosuggest";

import SearchIcon from "../svgs/search.svg";

const theme = {
  container: "relative mb-8",
  containerOpen: "",
  input:
    "bg-white shadow-md dark:bg-gray-800 rounded-lg placeholder-gray-400 pl-10 pr-3 py-3 w-full border-white dark:border-gray-500 border border-solid",
  inputOpen: "",
  inputFocused: "outline-none",
  suggestionsContainer: "",
  suggestionsContainerOpen:
    "absolute bg-white dark:bg-gray-800 shadow-lg rounded w-full mt-1 border-white dark:border-gray-500 border border-solid",
  suggestionsList: "",
  suggestion: "pl-10 pr-3 py-3",
  suggestionFirst: "",
  suggestionHighlighted: "bg-gray-500 bg-opacity-20 rounded",
  sectionContainer: "",
  sectionContainerFirst: "",
  sectionTitle: "",
};

const Unused = () => <div className=" border-sol " />;

const Search = ({ stops }) => {
  const router = useRouter();

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
