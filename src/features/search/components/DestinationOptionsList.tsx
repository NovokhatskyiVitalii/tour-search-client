import type { SearchOption } from "../types";

const ICONS: Record<SearchOption["type"], string> = {
  country: "🌍",
  city: "🏙️",
  hotel: "🏨",
};

type DestinationOptionsListProps = {
  options: SearchOption[];
  highlightIndex: number;
  isLoading: boolean;
  errorMessage: string | null;
  onHover: (index: number) => void;
  onSelect: (option: SearchOption) => void;
};

export const DestinationOptionsList = ({
  options,
  highlightIndex,
  isLoading,
  errorMessage,
  onHover,
  onSelect,
}: DestinationOptionsListProps) => {
  if (isLoading) {
    return (
      <div className="destination-select__dropdown">
        <div className="destination-select__state destination-select__state--loading">
          Завантаження...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="destination-select__dropdown">
        <div className="destination-select__state destination-select__state--error">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="destination-select__dropdown">
        <div className="destination-select__state">Нічого не знайдено</div>
      </div>
    );
  }

  return (
    <div className="destination-select__dropdown">
      <ul className="destination-select__options">
        {options.map((option, index) => {
          const isActive = highlightIndex === index;
          return (
            <li
              key={`${option.type}-${option.id}`}
              className={`destination-select__option${
                isActive ? " is-active" : ""
              }`}
              onMouseEnter={() => onHover(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(option);
              }}
            >
              <span className="destination-select__icon" aria-hidden="true">
                {option.flag ? (
                  <img
                    src={option.flag}
                    alt=""
                    className="destination-select__flag"
                  />
                ) : (
                  ICONS[option.type]
                )}
              </span>
              <div className="destination-select__option-content">
                <span className="destination-select__option-label">
                  {option.label}
                </span>
                {option.subtitle ? (
                  <span className="destination-select__option-subtitle">
                    {option.subtitle}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
