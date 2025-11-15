import { combineReducers } from "@reduxjs/toolkit";

import { searchFormReducer } from "./slices/formSlice";
import { searchSuggestionsReducer } from "./slices/suggestionsSlice";
import { toursReducer } from "./slices/toursSlice";

export const searchReducer = combineReducers({
  form: searchFormReducer,
  suggestions: searchSuggestionsReducer,
  tours: toursReducer,
});

export type SearchState = ReturnType<typeof searchReducer>;
