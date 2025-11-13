import type { FormEvent } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectSelectedOption } from "./selectors";
import DestinationSelect from "./components/DestinationSelect";

import "./SearchForm.scss";

const SearchForm = () => {
  const selected = useAppSelector(selectSelectedOption);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <DestinationSelect />
      <button
        type="submit"
        className="search-form__submit"
        disabled={!selected}
      >
        Знайти
      </button>
    </form>
  );
};

export default SearchForm;
