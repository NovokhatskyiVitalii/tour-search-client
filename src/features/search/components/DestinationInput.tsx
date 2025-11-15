import type {
  FormEvent,
  KeyboardEvent,
  MutableRefObject,
  RefObject,
} from "react";

type DestinationInputProps = {
  value: string;
  hasValue: boolean;
  onChange: (event: FormEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputRef:
    | RefObject<HTMLInputElement>
    | MutableRefObject<HTMLInputElement | null>;
};

export const DestinationInput = ({
  value,
  hasValue,
  onChange,
  onFocus,
  onKeyDown,
  onClear,
  inputRef,
}: DestinationInputProps) => {
  return (
    <div className="destination-select__input-wrapper">
      <input
        id="destination-input"
        ref={inputRef}
        type="text"
        value={value}
        placeholder="Оберіть країну, місто або готель"
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className="destination-select__input"
        autoComplete="off"
      />
      {hasValue ? (
        <button
          type="button"
          className="destination-select__clear"
          onClick={onClear}
          aria-label="Очистити"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
};
