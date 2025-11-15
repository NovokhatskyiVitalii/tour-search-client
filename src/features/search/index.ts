import { combineReducers } from "@reduxjs/toolkit";

import { searchFormReducer } from "./slices/formSlice";
import { searchSuggestionsReducer } from "./slices/suggestionsSlice";
import { toursReducer } from "./slices/toursSlice";
import { hotelsReducer } from "./slices/hotelsSlice";

export const searchReducer = combineReducers({
  form: searchFormReducer,
  suggestions: searchSuggestionsReducer,
  tours: toursReducer,
  hotels: hotelsReducer,
});

export type SearchState = ReturnType<typeof searchReducer>;
