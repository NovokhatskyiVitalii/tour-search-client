import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { SearchOption, Selection } from "../types";

type SearchFormState = {
  inputValue: string;
  selected: Selection | null;
};

const initialState: SearchFormState = {
  inputValue: "",
  selected: null,
};

const searchFormSlice = createSlice({
  name: "search/form",
  initialState,
  reducers: {
    setInputValue(state, action: PayloadAction<string>) {
      state.inputValue = action.payload;
    },
    setSelectedOption(state, action: PayloadAction<SearchOption | null>) {
      if (action.payload) {
        state.selected = {
          id: action.payload.id,
          label: action.payload.label,
          type: action.payload.type,
          countryId: action.payload.countryId,
          entity: action.payload.original,
        };
        state.inputValue = action.payload.label;
      } else {
        state.selected = null;
      }
    },
    clearSelection(state) {
      state.selected = null;
      state.inputValue = "";
    },
  },
});

export const { setInputValue, setSelectedOption, clearSelection } =
  searchFormSlice.actions;

export const searchFormReducer = searchFormSlice.reducer;
