import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";

const selectSearchState = (state: RootState) => state.search;
const selectFormState = (state: RootState) => selectSearchState(state).form;
const selectSuggestionsState = (state: RootState) =>
  selectSearchState(state).suggestions;
const selectToursState = (state: RootState) => selectSearchState(state).tours;

export const selectInputValue = createSelector(
  selectFormState,
  (form) => form.inputValue
);

export const selectSelectedOption = createSelector(
  selectFormState,
  (form) => form.selected
);

export const selectHasSelection = createSelector(
  selectSelectedOption,
  (selected) => Boolean(selected)
);

export const selectCountries = createSelector(
  selectSuggestionsState,
  (suggestions) => suggestions.countries
);

export const selectCountriesStatus = createSelector(
  selectSuggestionsState,
  (suggestions) => suggestions.countriesStatus
);

export const selectCountriesError = createSelector(
  selectSuggestionsState,
  (suggestions) => suggestions.countriesError
);

export const selectSearchResults = createSelector(
  selectSuggestionsState,
  (suggestions) => suggestions.searchResults
);

export const selectSearchStatus = createSelector(
  selectSuggestionsState,
  (suggestions) => suggestions.searchStatus
);

export const selectSearchError = createSelector(
  selectSuggestionsState,
  (suggestions) => suggestions.searchError
);

export const selectLastQuery = createSelector(
  selectSuggestionsState,
  (suggestions) => suggestions.lastQuery
);

export const selectToursPrices = createSelector(
  selectToursState,
  (tours) => tours.prices
);

export const selectToursStatus = createSelector(
  selectToursState,
  (tours) => tours.status
);

export const selectToursError = createSelector(
  selectToursState,
  (tours) => tours.error
);

export const selectToursActiveToken = createSelector(
  selectToursState,
  (tours) => tours.activeToken
);
