import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getHotel, getPrice } from "#api";
import type { HotelDetails } from "../types";
import type { PriceOffer } from "./toursSlice";

type ErrorResponse = {
  code: number;
  error: true;
  message: string;
};

const readJson = async <T>(response: Response): Promise<T | ErrorResponse> => {
  const payload = (await response.json()) as T | ErrorResponse;
  return payload;
};

export const fetchTourDetails = createAsyncThunk<
  { price: PriceOffer; hotel: HotelDetails | null },
  { priceId: string; hotelId?: string },
  { rejectValue: string }
>(
  "search/tourDetails/fetchTourDetails",
  async ({ priceId, hotelId }, { rejectWithValue }) => {
    try {
      const priceResponse = await getPrice(priceId);
      const priceData = await readJson<PriceOffer | ErrorResponse>(
        priceResponse
      );

      if (!priceResponse.ok || "error" in priceData) {
        throw new Error(
          (priceData as ErrorResponse).message ?? "Не вдалося завантажити ціну"
        );
      }

      const price = priceData as PriceOffer;
      let hotel: HotelDetails | null = null;

      // if hotelId is passed or exists in price, load hotel
      const targetHotelId = hotelId || price.hotelID;
      if (targetHotelId) {
        try {
          // getHotel accepts string | number, try to convert to number if possible
          // as hotel.id is a number in the database
          const hotelIdToFetch =
            typeof targetHotelId === "string" && !isNaN(Number(targetHotelId))
              ? Number(targetHotelId)
              : targetHotelId;
          const hotelResponse = await getHotel(hotelIdToFetch);
          const hotelData = await readJson<HotelDetails | ErrorResponse>(
            hotelResponse
          );

          if (hotelResponse.ok && !("error" in hotelData)) {
            hotel = hotelData as HotelDetails;
          }
        } catch (errorResponse) {
          // getHotel returns Promise.reject(Response) on error
          // Try to read error message if it's a Response
          if (errorResponse instanceof Response) {
            try {
              const errorData = await readJson<ErrorResponse>(errorResponse);
              console.warn(
                "Failed to load hotel:",
                errorData.message || "Unknown error"
              );
            } catch {
              // ignore parsing error
            }
          }
        }
      }

      return {
        price,
        hotel,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Не вдалося завантажити деталі туру"
      );
    }
  }
);

type TourDetailsState = {
  price: PriceOffer | null;
  hotel: HotelDetails | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: TourDetailsState = {
  price: null,
  hotel: null,
  status: "idle",
  error: null,
};

const tourDetailsSlice = createSlice({
  name: "search/tourDetails",
  initialState,
  reducers: {
    resetTourDetails(state) {
      state.price = null;
      state.hotel = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchTourDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTourDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.price = action.payload.price;
        state.hotel = action.payload.hotel;
      })
      .addCase(fetchTourDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Не вдалося завантажити деталі туру";
      }),
});

export const { resetTourDetails } = tourDetailsSlice.actions;

export const tourDetailsReducer = tourDetailsSlice.reducer;
