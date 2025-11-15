import { Link } from "react-router-dom";

import { AppRoute } from "../../../app/routes";
import type { PriceOffer } from "../slices/toursSlice";
import type { Hotel } from "../slices/hotelsSlice";
import { formatDate, formatPrice } from "../utils/format";

import "./TourCard.scss";

type TourCardProps = {
  price: PriceOffer;
  hotel: Hotel | null;
};

const TourCard = ({ price, hotel }: TourCardProps) => {
  if (!hotel) {
    return null;
  }

  return (
    <article className="tour-card">
      <div className="tour-card__image-wrapper">
        <img
          src={hotel.img}
          alt={hotel.name}
          className="tour-card__image"
          loading="lazy"
        />
      </div>
      <div className="tour-card__content">
        <h3 className="tour-card__title">{hotel.name}</h3>
        <p className="tour-card__location">
          {hotel.countryName}, {hotel.cityName}
        </p>
        <p className="tour-card__date">{formatDate(price.startDate)}</p>
        <div className="tour-card__footer">
          <span className="tour-card__price">
            {formatPrice(price.amount, price.currency)}
          </span>
          <Link
            to={AppRoute.Tour.replace(":priceId", price.id)}
            className="tour-card__link"
          >
            Відкрити ціну
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TourCard;
