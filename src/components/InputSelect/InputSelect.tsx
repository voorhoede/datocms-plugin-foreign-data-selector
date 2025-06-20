import AsyncSelect, { AsyncProps } from "react-select/async";
import { forwardRef } from "react";
import { FieldError, FieldHint } from "datocms-react-ui";

import "./InputSelect.css";
import ChevronDownIcon from "../ChevronDownIcon/ChevronDownIcon";
import SelectOption from "../SelectOption/SelectOption";
import clsx from "clsx";

type Props = {
  itemLength: number;
  min?: number;
  max?: number;
} & AsyncProps<any, any, any>;

export default forwardRef<any, Props>(
  function InputSelect({ itemLength, min, max, ...props }, ref) {
    return (
      <>
        <AsyncSelect
        {...props}
        className="input-select"
        classNames={{
          control: ({ isDisabled }) => clsx(
            "input-select__control",
            { "input-select__control--disabled": isDisabled }
          ),
          indicatorSeparator: () => "input-select__indicator-separator",
          menu: () => "input-select__menu",
          option: ({ isFocused, isSelected }) => clsx(
            "input-select__option",
            { "input-select__option--focused": isFocused },
            { "input-select__option--selected": isSelected }
          ),
        }}
        components={{
          DropdownIndicator: () => (
            <div className="input-select__dropdown-indicator">
              <ChevronDownIcon/>
            </div>
          )
        }}
        formatOptionLabel={(option) => <SelectOption option={option} />}
        placeholder=""
        isDisabled={itemLength === max}
        ref={ref} />
        { (min && itemLength < min) && <FieldError>You need to select at least {min} items. Select { min - itemLength } more item(s).</FieldError> }
        { !(min && itemLength < min) && max && <FieldHint>You have selected {itemLength} / {max} items.</FieldHint> }
      </>
    );
  }
);
