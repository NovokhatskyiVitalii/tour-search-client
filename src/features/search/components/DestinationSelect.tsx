import { DestinationInput } from "./DestinationInput";
import { DestinationOptionsList } from "./DestinationOptionsList";
import { useDestinationSelect } from "../hooks/useDestinationSelect";

import "./DestinationSelect.scss";

const DestinationSelect = () => {
  const {
    state: {
      inputValue,
      hasValue,
      isOpen,
      options,
      highlightIndex,
      isLoading,
      errorMessage,
    },
    refs: { wrapperRef, inputRef },
    actions: {
      openDropdown,
      handleInputChange,
      handleKeyDown,
      handleOptionSelect,
      handleOptionHover,
      handleClear,
    },
  } = useDestinationSelect();

  return (
    <div className="destination-select" ref={wrapperRef}>
      <div className="destination-select__control">
        <label
          className="destination-select__label"
          htmlFor="destination-input"
        >
          Напрямок подорожі
        </label>
        <DestinationInput
          inputRef={inputRef}
          value={inputValue}
          hasValue={hasValue}
          onChange={handleInputChange}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          onClear={handleClear}
        />
      </div>
      {isOpen && (
        <DestinationOptionsList
          options={options}
          highlightIndex={highlightIndex}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onHover={handleOptionHover}
          onSelect={handleOptionSelect}
        />
      )}
    </div>
  );
};

export default DestinationSelect;
