import { useAppSelector } from "../../../app/hooks";
import {
  selectToursError,
  selectToursPrices,
  selectToursStatus,
} from "../selectors";

import "./ToursSearchResults.scss";

const ToursSearchResults = () => {
  const status = useAppSelector(selectToursStatus);
  const prices = useAppSelector(selectToursPrices);
  const error = useAppSelector(selectToursError);

  const pricesCount = Object.keys(prices).length;
  const isEmpty = status === "succeeded" && pricesCount === 0;

  if (status === "idle") {
    return null;
  }

  if (status === "loading") {
    return (
      <div className="tours-search-results">
        <div className="tours-search-results__state tours-search-results__state--loading">
          <div className="tours-search-results__spinner" aria-hidden="true">
            <div className="tours-search-results__spinner-circle"></div>
          </div>
          <p className="tours-search-results__state-text">
            Виконується пошук турів...
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed" && error) {
    return (
      <div className="tours-search-results">
        <div className="tours-search-results__state tours-search-results__state--error">
          <p className="tours-search-results__state-text">{error}</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="tours-search-results">
        <div className="tours-search-results__state">
          <p className="tours-search-results__state-text">
            За вашим запитом турів не знайдено
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default ToursSearchResults;
