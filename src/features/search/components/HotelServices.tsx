import type { HotelServices } from "../types";

import "./HotelServices.scss";

type HotelServicesProps = {
  services?: HotelServices;
};

const SERVICE_LABELS: Record<keyof HotelServices, string> = {
  wifi: "Wi-Fi",
  aquapark: "Аквапарк",
  tennis_court: "Тенісний корт",
  laundry: "Пральня",
  parking: "Парковка",
};

const HotelServicesComponent = ({ services }: HotelServicesProps) => {
  if (!services) {
    return null;
  }

  const availableServices = Object.entries(services).filter(
    ([, value]) => value === "yes"
  );

  if (availableServices.length === 0) {
    return null;
  }

  return (
    <div className="hotel-services">
      <h3 className="hotel-services__title">Зручності та послуги</h3>
      <ul className="hotel-services__list">
        {availableServices.map(([key]) => (
          <li key={key} className="hotel-services__item">
            {SERVICE_LABELS[key as keyof HotelServices]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelServicesComponent;
