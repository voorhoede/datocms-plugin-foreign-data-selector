import AsyncSelect, { AsyncProps } from "react-select/async";
import { forwardRef } from "react";
import { FieldError, FieldHint } from "datocms-react-ui";

import "./InputSelect.css";
import ChevronDownIcon from "../ChevronDownIcon/ChevronDownIcon";

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
          control: () => "input-select__control",
          indicatorSeparator: () => "input-select__indicator-separator",
        }}
        components={{
          DropdownIndicator: () => (
            <div className="input-select__dropdown-indicator">
              <ChevronDownIcon/>
            </div>
          )
        }}
        placeholder=""
        isDisabled={itemLength === max}
        ref={ref} />
        { (min && itemLength < min) && <FieldError>You need to select at least {min} items. Select { min - itemLength } more item(s).</FieldError> }
        { max && <FieldHint>You have selected {itemLength} / {max} items.</FieldHint> }
      </>
    );
  }
);
