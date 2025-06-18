import AsyncSelect, { AsyncProps } from "react-select/async";
import { forwardRef } from "react";
import { FieldError, FieldHint } from "datocms-react-ui";

import "./InputSelect.css";

type Props = {
  itemLength: number;
  min?: number;
  max?: number;
} & AsyncProps<any, any, any>;

export default forwardRef<any, Props>(
  function InputSelect({ itemLength, min, max, ...props }, ref) {
    return (
      <>
        <AsyncSelect className="input-select" isDisabled={itemLength === max} {...props} ref={ref} />
        { (min && itemLength < min) && <FieldError>You need to select at least {min} items. Select { min - itemLength } more item(s).</FieldError> }
        { max && <FieldHint>You have selected {itemLength} / {max} items.</FieldHint> }
      </>
    );
  }
);
