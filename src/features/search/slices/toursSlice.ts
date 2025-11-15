import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getSearchPrices, startSearchPrices, stopSearchPrices } from "#api";

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

const waitUntil = (isoString: string, signal?: AbortSignal): Promise<void> => {
  const targetTime = new Date(isoString).getTime();
  const now = Date.now();
  const delay = Math.max(0, targetTime - now);
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, delay);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new Error("Search cancelled"));
      });
    }
  });
};

export const cancelSearch = createAsyncThunk<
  void,
  { token: string },
  { rejectValue: string }
>("search/tours/cancelSearch", async ({ token }) => {
  try {
    const response = await stopSearchPrices(token);
    if (!response.ok) {
      const errorData = await readJson<ErrorResponse>(response);
      throw new Error(errorData.message ?? "Не вдалося скасувати пошук");
    }
  } catch (error) {
    // Игнорируем ошибки отмены (токен может быть уже недействителен)
    console.warn("Failed to cancel search:", error);
  }
});

export const searchTours = createAsyncThunk<
  PricesMap,
  { countryID: string },
  { rejectValue: string; state: { search: { tours: ToursState } } }
>(
  "search/tours/searchTours",
  async ({ countryID }, { rejectWithValue, signal, getState, dispatch }) => {
    // Отменяем предыдущий поиск, если он активен
    const currentState = getState();
    const activeToken = currentState.search.tours.activeToken;
    if (activeToken) {
      await dispatch(cancelSearch({ token: activeToken }));
    }
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

      // Сохраняем токен в state через dispatch
      // Используем прямой dispatch с типом action
      dispatch({ type: "search/tours/setActiveToken", payload: token });

      while (true) {
        if (signal.aborted) {
          throw new Error("Search cancelled");
        }

        // Проверяем, не изменился ли токен (новый поиск начался)
        const latestState = getState();
        if (latestState.search.tours.activeToken !== token) {
          throw new Error("Search cancelled");
        }

        await waitUntil(waitUntilTime, signal);

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
    setActiveToken(state, action: { payload: string }) {
      state.activeToken = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(searchTours.pending, (state) => {
        state.status = "loading";
        state.error = null;
        // Токен будет установлен после успешного startSearchPrices
        // Пока оставляем null, чтобы не блокировать отмену старого поиска
      })
      .addCase(searchTours.fulfilled, (state, action) => {
        // Применяем результат только если поиск все еще активен (status === "loading")
        // Если начался новый поиск, status уже изменился, и мы игнорируем старый результат
        if (state.status === "loading") {
          state.status = "succeeded";
          state.prices = action.payload;
          state.activeToken = null;
        }
      })
      .addCase(searchTours.rejected, (state, action) => {
        // Игнорируем ошибки отмены
        if (action.payload === "Search cancelled") {
          // Если поиск был отменен, просто сбрасываем состояние
          if (state.activeToken) {
            state.activeToken = null;
          }
          return;
        }
        state.status = "failed";
        state.error = action.payload ?? "Не вдалося виконати пошук турів";
        state.activeToken = null;
      })
      .addCase(cancelSearch.fulfilled, (state) => {
        // После отмены сбрасываем токен
        state.activeToken = null;
      }),
});

export const { resetTours, setActiveToken } = toursSlice.actions;

export const toursReducer = toursSlice.reducer;
