import type { FormEvent, KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCountries,
  selectCountriesError,
  selectCountriesStatus,
  selectInputValue,
  selectLastQuery,
  selectSearchError,
  selectSearchResults,
  selectSearchStatus,
  selectSelectedOption,
} from "../selectors";
import {
  clearSelection,
  setInputValue,
  setSelectedOption,
} from "../slices/formSlice";
import { fetchCountries, searchGeo } from "../slices/suggestionsSlice";
import type { SearchOption } from "../types";
import { useDebounce } from "../../../shared/hooks/useDebounce";

type DropdownMode = "countries" | "search";

export const useDestinationSelect = () => {
  const dispatch = useAppDispatch();

  const inputValue = useAppSelector(selectInputValue);
  const selectedOption = useAppSelector(selectSelectedOption);
  const countries = useAppSelector(selectCountries);
  const countriesStatus = useAppSelector(selectCountriesStatus);
  const countriesError = useAppSelector(selectCountriesError);
  const searchResults = useAppSelector(selectSearchResults);
  const searchStatus = useAppSelector(selectSearchStatus);
  const searchError = useAppSelector(selectSearchError);
  const lastQuery = useAppSelector(selectLastQuery);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const debouncedInput = useDebounce(inputValue, 250);

  const trimmedInput = inputValue.trim();
  const mode: DropdownMode =
    selectedOption?.type === "country" || trimmedInput.length === 0
      ? "countries"
      : "search";

  const options = useMemo(
    () => (mode === "countries" ? countries : searchResults),
    [mode, countries, searchResults]
  );

  const resetHighlight = useCallback(() => setHighlightIndex(-1), []);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
    resetHighlight();
  }, [resetHighlight]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    resetHighlight();
  }, [resetHighlight]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "countries") {
      if (countriesStatus === "idle") {
        dispatch(fetchCountries());
      }
      return;
    }

    const query = debouncedInput.trim();
    if (
      query.length > 0 &&
      (query !== lastQuery || searchStatus === "failed")
    ) {
      dispatch(searchGeo({ query }));
    }
  }, [
    isOpen,
    mode,
    countriesStatus,
    dispatch,
    debouncedInput,
    lastQuery,
    searchStatus,
  ]);

  const handleInputChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      dispatch(setInputValue(value));
      if (selectedOption) {
        dispatch(setSelectedOption(null));
      }
      if (!isOpen) {
        openDropdown();
      }
    },
    [dispatch, selectedOption, isOpen, openDropdown]
  );

  const handleOptionSelect = useCallback(
    (option: SearchOption) => {
      dispatch(setSelectedOption(option));
      closeDropdown();
    },
    [dispatch, closeDropdown]
  );

  const handleClear = useCallback(() => {
    dispatch(clearSelection());
    openDropdown();
    inputRef.current?.focus();
  }, [dispatch, openDropdown]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (event.key === "ArrowDown") {
          openDropdown();
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightIndex((prev) => {
          const next = prev + 1;
          return next >= options.length ? 0 : next;
        });
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightIndex((prev) => {
          if (prev <= 0) {
            return options.length - 1;
          }
          return prev - 1;
        });
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < options.length) {
          handleOptionSelect(options[highlightIndex]);
        } else {
          closeDropdown();
        }
      }

      if (event.key === "Escape") {
        closeDropdown();
      }
    },
    [
      isOpen,
      openDropdown,
      options,
      highlightIndex,
      handleOptionSelect,
      closeDropdown,
    ]
  );

  const handleOptionHover = useCallback((index: number) => {
    setHighlightIndex(index);
  }, []);

  const isLoading =
    (mode === "countries" && countriesStatus === "loading") ||
    (mode === "search" && searchStatus === "loading");

  const errorMessage =
    mode === "countries"
      ? countriesError
      : mode === "search"
      ? searchError
      : null;

  return {
    state: {
      inputValue,
      hasValue: Boolean(inputValue),
      isOpen,
      options,
      highlightIndex,
      isLoading,
      errorMessage,
    },
    refs: {
      wrapperRef,
      inputRef,
    },
    actions: {
      openDropdown,
      closeDropdown,
      handleInputChange,
      handleKeyDown,
      handleOptionSelect,
      handleOptionHover,
      handleClear,
    },
  };
};
