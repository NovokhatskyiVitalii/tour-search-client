import { combineReducers } from "@reduxjs/toolkit";

import { searchFormReducer } from "./slices/formSlice";
import { searchSuggestionsReducer } from "./slices/suggestionsSlice";

export const searchReducer = combineReducers({
  form: searchFormReducer,
  suggestions: searchSuggestionsReducer,
});

export type SearchState = ReturnType<typeof searchReducer>;
