import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getSearchPrices, startSearchPrices } from "#api";

export type PriceOffer = {
  id: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  hotelID?: string;
};

export type PricesMap = Record<string, PriceOffer>;

type StartSearchResponse = {
  token: string;
  waitUntil: string;
};

type GetSearchPricesResponse = {
  prices: PricesMap;
};

type ErrorResponse = {
  code: number;
  error: true;
  message: string;
  waitUntil?: string;
};

const readJson = async <T>(response: Response): Promise<T | ErrorResponse> => {
  const payload = (await response.json()) as T | ErrorResponse;
  return payload;
};

const waitUntil = (isoString: string): Promise<void> => {
  const targetTime = new Date(isoString).getTime();
  const now = Date.now();
  const delay = Math.max(0, targetTime - now);
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const searchTours = createAsyncThunk<
  PricesMap,
  { countryID: string },
  { rejectValue: string }
>(
  "search/tours/searchTours",
  async ({ countryID }, { rejectWithValue, signal }) => {
    const maxRetries = 2;

    try {
      const startResponse = await startSearchPrices(countryID);
      if (!startResponse.ok) {
        const errorData = await readJson<ErrorResponse>(startResponse);
        throw new Error(errorData.message ?? "Не вдалося запустити пошук");
      }

      const startDataRaw = await readJson<StartSearchResponse>(startResponse);
      if ("error" in startDataRaw) {
        throw new Error(
          (startDataRaw as ErrorResponse).message ??
            "Не вдалося запустити пошук"
        );
      }

      const startData = startDataRaw as StartSearchResponse;
      const token = startData.token;
      let waitUntilTime: string = startData.waitUntil;

      while (true) {
        if (signal.aborted) {
          throw new Error("Search cancelled");
        }

        await waitUntil(waitUntilTime);

        let retryCount = 0;
        let pricesData: GetSearchPricesResponse | ErrorResponse | null = null;

        while (retryCount <= maxRetries) {
          try {
            const pricesResponse = await getSearchPrices(token);
            pricesData = await readJson<
              GetSearchPricesResponse | ErrorResponse
            >(pricesResponse);

            if (pricesResponse.ok && "prices" in pricesData) {
              return pricesData.prices;
            }

            if (
              pricesResponse.status === 425 &&
              "waitUntil" in pricesData &&
              pricesData.waitUntil
            ) {
              waitUntilTime = pricesData.waitUntil;
              break;
            }

            if (
              pricesResponse.status === 404 ||
              pricesResponse.status === 400
            ) {
              throw new Error(
                (pricesData as ErrorResponse).message ??
                  "Не вдалося отримати результати"
              );
            }

            throw new Error(
              (pricesData as ErrorResponse).message ?? "Unknown error"
            );
          } catch (error) {
            if (
              retryCount < maxRetries &&
              !(error instanceof Error && error.message.includes("425"))
            ) {
              retryCount++;
              await new Promise((resolve) => setTimeout(resolve, 1000));
              continue;
            }
            throw error;
          }
        }

        if (pricesData && "waitUntil" in pricesData && pricesData.waitUntil) {
          waitUntilTime = pricesData.waitUntil;
          continue;
        }
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Не вдалося виконати пошук турів"
      );
    }
  }
);

type ToursState = {
  prices: PricesMap;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  activeToken: string | null;
};

const initialState: ToursState = {
  prices: {},
  status: "idle",
  error: null,
  activeToken: null,
};

const toursSlice = createSlice({
  name: "search/tours",
  initialState,
  reducers: {
    resetTours(state) {
      state.prices = {};
      state.status = "idle";
      state.error = null;
      state.activeToken = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(searchTours.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchTours.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prices = action.payload;
        state.activeToken = null;
      })
      .addCase(searchTours.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Не вдалося виконати пошук турів";
        state.activeToken = null;
      }),
});

export const { resetTours } = toursSlice.actions;

export const toursReducer = toursSlice.reducer;
