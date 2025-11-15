import { combineReducers } from "@reduxjs/toolkit";

import { searchFormReducer } from "./slices/formSlice";
import { searchSuggestionsReducer } from "./slices/suggestionsSlice";
import { toursReducer } from "./slices/toursSlice";
import { hotelsReducer } from "./slices/hotelsSlice";
import { tourDetailsReducer } from "./slices/tourDetailsSlice";

export const searchReducer = combineReducers({
  form: searchFormReducer,
  suggestions: searchSuggestionsReducer,
  tours: toursReducer,
  hotels: hotelsReducer,
  tourDetails: tourDetailsReducer,
});

export type SearchState = ReturnType<typeof searchReducer>;
