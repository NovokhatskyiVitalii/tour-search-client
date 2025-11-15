import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectToursError,
  selectToursPrices,
  selectToursStatus,
  selectHotelsByCountry,
  selectSelectedOption,
} from "../selectors";
import { fetchHotels } from "../slices/hotelsSlice";
import type { PriceOffer } from "../slices/toursSlice";
import TourCard from "./TourCard";

import "./ToursSearchResults.scss";

const ToursSearchResults = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectToursStatus);
  const prices = useAppSelector(selectToursPrices);
  const error = useAppSelector(selectToursError);
  const selectedOption = useAppSelector(selectSelectedOption);
  const hotelsByCountry = useAppSelector(selectHotelsByCountry);

  const countryID = selectedOption?.countryId;

  useEffect(() => {
    if (countryID && !hotelsByCountry[countryID]) {
      dispatch(fetchHotels({ countryID }));
    }
  }, [countryID, hotelsByCountry, dispatch]);

  const toursWithHotels = useMemo(() => {
    if (!countryID || !hotelsByCountry[countryID]) {
      return [];
    }

    const hotels = hotelsByCountry[countryID];
    const pricesArray: Array<{ price: PriceOffer; hotelId: string }> =
      Object.values(prices).map((price) => ({
        price,
        hotelId: price.hotelID || "",
      }));

    return pricesArray
      .map(({ price, hotelId }) => {
        const hotel = hotelId ? hotels[hotelId] : null;
        return hotel ? { price, hotel } : null;
      })
      .filter(
        (
          item
        ): item is {
          price: PriceOffer;
          hotel: NonNullable<typeof item>["hotel"];
        } => item !== null
      )
      .sort((a, b) => a.price.amount - b.price.amount);
  }, [prices, countryID, hotelsByCountry]);

  const pricesCount = Object.keys(prices).length;
  const isEmpty = status === "succeeded" && pricesCount === 0;
  const hasResults = toursWithHotels.length > 0;

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

  if (!hasResults) {
    return null;
  }

  return (
    <div className="tours-search-results">
      <div className="tours-search-results__container">
        <div className="tours-search-results__grid">
          {toursWithHotels.map(({ price, hotel }) => (
            <TourCard key={price.id} price={price} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToursSearchResults;
