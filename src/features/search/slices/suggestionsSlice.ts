import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getCountries, searchGeo as searchGeoApi } from "#api";
import type {
  CountriesMap,
  FetchStatus,
  GeoEntity,
  GeoResponseMap,
  SearchOption,
} from "../types";

const readJson = async <T>(response: Response) => {
  const payload = (await response.json()) as T;
  if (!response.ok) {
    const message =
      (payload as { message?: string }).message ?? "Request failed";
    throw new Error(message);
  }
  return payload;
};

const geoEntityToOption = (entity: GeoEntity): SearchOption => {
  if (entity.type === "country") {
    return {
      id: entity.id,
      label: entity.name,
      type: "country",
      flag: entity.flag,
      countryId: entity.id,
      original: entity,
    };
  }

  if (entity.type === "city") {
    return {
      id: String(entity.id),
      label: entity.name,
      type: "city",
      subtitle: "Місто",
      countryId: entity.countryId,
      original: entity,
    };
  }

  return {
    id: String(entity.id),
    label: entity.name,
    type: "hotel",
    subtitle: `${entity.cityName}, ${entity.countryName}`,
    countryId: entity.countryId,
    original: entity,
  };
};

const mapCountries = (countries: CountriesMap) =>
  Object.values(countries)
    .map((country) =>
      geoEntityToOption({
        ...country,
        type: "country",
      })
    )
    .sort((a, b) => a.label.localeCompare(b.label, "uk"));

const mapGeoToOptions = (entries: GeoResponseMap) =>
  Object.values(entries)
    .map((item) => geoEntityToOption(item))
    .sort((a, b) => a.label.localeCompare(b.label, "uk"));

export const fetchCountries = createAsyncThunk<
  SearchOption[],
  void,
  { rejectValue: string }
>("search/suggestions/fetchCountries", async (_, { rejectWithValue }) => {
  try {
    const response = await getCountries();
    const data = await readJson<CountriesMap>(response);
    return mapCountries(data);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Не вдалося завантажити країни"
    );
  }
});

export const searchGeo = createAsyncThunk<
  { options: SearchOption[]; query: string },
  { query: string },
  { rejectValue: string }
>("search/suggestions/searchGeo", async ({ query }, { rejectWithValue }) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { options: [], query: "" };
  }

  try {
    const response = await searchGeoApi(trimmed);
    const data = await readJson<GeoResponseMap>(response);
    return { options: mapGeoToOptions(data), query: trimmed };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Не вдалося виконати пошук"
    );
  }
});

type SuggestionsState = {
  countries: SearchOption[];
  countriesStatus: FetchStatus;
  countriesError: string | null;
  searchResults: SearchOption[];
  searchStatus: FetchStatus;
  searchError: string | null;
  lastQuery: string;
};

const initialState: SuggestionsState = {
  countries: [],
  countriesStatus: "idle",
  countriesError: null,
  searchResults: [],
  searchStatus: "idle",
  searchError: null,
  lastQuery: "",
};

const suggestionsSlice = createSlice({
  name: "search/suggestions",
  initialState,
  reducers: {
    resetSearchResults(state) {
      state.searchResults = [];
      state.searchStatus = "idle";
      state.searchError = null;
      state.lastQuery = "";
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.countriesStatus = "loading";
        state.countriesError = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countriesStatus = "succeeded";
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.countriesStatus = "failed";
        state.countriesError =
          action.payload ?? "Не вдалося завантажити країни";
      })
      .addCase(searchGeo.pending, (state) => {
        state.searchStatus = "loading";
        state.searchError = null;
      })
      .addCase(searchGeo.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.searchResults = action.payload.options;
        state.lastQuery = action.payload.query;
      })
      .addCase(searchGeo.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.searchError = action.payload ?? "Не вдалося виконати пошук";
        state.searchResults = [];
      }),
});

export const { resetSearchResults } = suggestionsSlice.actions;

export const searchSuggestionsReducer = suggestionsSlice.reducer;
