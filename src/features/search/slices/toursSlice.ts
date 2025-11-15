import { createSlice } from "@reduxjs/toolkit";

export type PriceOffer = {
  id: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  hotelID?: string;
};

export type PricesMap = Record<string, PriceOffer>;

type ToursState = {
  prices: PricesMap;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ToursState = {
  prices: {},
  status: "idle",
  error: null,
};

const toursSlice = createSlice({
  name: "search/tours",
  initialState,
  reducers: {
    setPrices(state, action: { payload: PricesMap }) {
      state.prices = action.payload;
      state.status = "succeeded";
    },
    setLoading(state) {
      state.status = "loading";
      state.error = null;
    },
    setError(state, action: { payload: string }) {
      state.status = "failed";
      state.error = action.payload;
    },
    resetTours(state) {
      state.prices = {};
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { setPrices, setLoading, setError, resetTours } =
  toursSlice.actions;

export const toursReducer = toursSlice.reducer;
