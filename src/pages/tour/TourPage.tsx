import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Container from "../../ui/layout/Container/Container";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectTourDetailsPrice,
  selectTourDetailsHotel,
  selectTourDetailsStatus,
  selectTourDetailsError,
  selectToursPrices,
} from "../../features/search/selectors";
import {
  fetchTourDetails,
  resetTourDetails,
} from "../../features/search/slices/tourDetailsSlice";
import {
  formatDate,
  formatPrice,
  calculateDuration,
} from "../../features/search/utils/format";
import HotelServices from "../../features/search/components/HotelServices";

import "./TourPage.scss";

const TourPage = () => {
  const { priceId } = useParams<{ priceId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const price = useAppSelector(selectTourDetailsPrice);
  const hotel = useAppSelector(selectTourDetailsHotel);
  const status = useAppSelector(selectTourDetailsStatus);
  const error = useAppSelector(selectTourDetailsError);
  const toursPrices = useAppSelector(selectToursPrices);

  useEffect(() => {
    if (!priceId) {
      navigate("/");
      return;
    }

    // try to get hotelId from cache
    const cachedPrice = toursPrices[priceId];
    const hotelId = cachedPrice?.hotelID;

    // fetchTourDetails will get hotelId from price if it is not passed
    // and will handle type conversion internally
    dispatch(fetchTourDetails({ priceId, hotelId }));

    return () => {
      dispatch(resetTourDetails());
    };
  }, [priceId, dispatch, navigate, toursPrices]);

  if (status === "loading") {
    return (
      <section className="tour-page">
        <Container>
          <div className="tour-page__panel">
            <div className="tour-page__loading">
              <div className="tour-page__spinner" aria-hidden="true">
                <div className="tour-page__spinner-circle"></div>
              </div>
              <p className="tour-page__loading-text">
                Завантаження деталей туру...
              </p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (status === "failed" && error) {
    return (
      <section className="tour-page">
        <Container>
          <div className="tour-page__panel">
            <div className="tour-page__error">
              <p className="tour-page__error-text">{error}</p>
              <button
                className="tour-page__back-button"
                onClick={() => navigate("/")}
              >
                Повернутися до пошуку
              </button>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!price) {
    return null;
  }

  const duration = calculateDuration(price.startDate, price.endDate);

  return (
    <section className="tour-page">
      <Container>
        <div className="tour-page__panel">
          <button
            className="tour-page__back-button"
            onClick={() => navigate("/")}
          >
            ← Повернутися до пошуку
          </button>

          {hotel && (
            <>
              <div className="tour-page__header">
                <h1 className="tour-page__title">{hotel.name}</h1>
                <p className="tour-page__location">
                  {hotel.countryName}, {hotel.cityName}
                </p>
              </div>

              <div className="tour-page__image-wrapper">
                <img
                  src={hotel.img}
                  alt={hotel.name}
                  className="tour-page__image"
                />
              </div>

              {hotel.description && (
                <div className="tour-page__description">
                  <h2 className="tour-page__section-title">Опис готелю</h2>
                  <p className="tour-page__description-text">
                    {hotel.description}
                  </p>
                </div>
              )}

              <HotelServices services={hotel.services} />
            </>
          )}

          <div className="tour-page__tour-info">
            <h2 className="tour-page__section-title">Інформація про тур</h2>
            <div className="tour-page__tour-details">
              <div className="tour-page__detail-item">
                <span className="tour-page__detail-label">Дата початку:</span>
                <span className="tour-page__detail-value">
                  {formatDate(price.startDate)}
                </span>
              </div>
              <div className="tour-page__detail-item">
                <span className="tour-page__detail-label">
                  Дата завершення:
                </span>
                <span className="tour-page__detail-value">
                  {formatDate(price.endDate)}
                </span>
              </div>
              <div className="tour-page__detail-item">
                <span className="tour-page__detail-label">Тривалість:</span>
                <span className="tour-page__detail-value">
                  {duration} {duration === 1 ? "день" : "днів"}
                </span>
              </div>
              <div className="tour-page__detail-item tour-page__detail-item--price">
                <span className="tour-page__detail-label">Ціна:</span>
                <span className="tour-page__detail-value tour-page__detail-value--price">
                  {formatPrice(price.amount, price.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TourPage;
