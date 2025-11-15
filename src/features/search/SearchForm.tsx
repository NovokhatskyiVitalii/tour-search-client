import type { FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectSelectedOption,
  selectToursError,
  selectToursStatus,
} from "./selectors";
import { searchTours } from "./slices/toursSlice";
import DestinationSelect from "./components/DestinationSelect";

import "./SearchForm.scss";

const SearchForm = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedOption);
  const toursStatus = useAppSelector(selectToursStatus);
  const toursError = useAppSelector(selectToursError);

  // Поиск работает для любой выбранной опции, если у неё есть countryId
  // (страна, город или отель - все они относятся к стране)
  const canSearch = selected?.countryId !== undefined;

  const isLoading = toursStatus === "loading";
  const isDisabled = !canSearch || isLoading;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSearch && selected.countryId) {
      dispatch(searchTours({ countryID: selected.countryId }));
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <DestinationSelect />
      <button
        type="submit"
        className="search-form__submit"
        disabled={isDisabled}
      >
        {isLoading ? "Пошук..." : "Знайти"}
      </button>
      {toursError && (
        <div className="search-form__error" role="alert">
          {toursError}
        </div>
      )}
    </form>
  );
};

export default SearchForm;
