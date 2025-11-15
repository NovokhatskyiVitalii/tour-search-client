import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getHotels } from "#api";

export type Hotel = {
  id: number;
  name: string;
  img: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
};

export type HotelsMap = Record<string, Hotel>;

type HotelsResponse = HotelsMap;

const readJson = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json()) as T;
  if (!response.ok) {
    throw new Error("Failed to fetch hotels");
  }
  return payload;
};

export const fetchHotels = createAsyncThunk<
  HotelsMap,
  { countryID: string },
  { rejectValue: string }
>("search/hotels/fetchHotels", async ({ countryID }, { rejectWithValue }) => {
  try {
    const response = await getHotels(countryID);
    const data = await readJson<HotelsResponse>(response);
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Не вдалося завантажити готелі"
    );
  }
});

type HotelsState = {
  hotelsByCountry: Record<string, HotelsMap>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: HotelsState = {
  hotelsByCountry: {},
  status: "idle",
  error: null,
};

const hotelsSlice = createSlice({
  name: "search/hotels",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hotelsByCountry[action.meta.arg.countryID] = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Не вдалося завантажити готелі";
      }),
});

export const hotelsReducer = hotelsSlice.reducer;
