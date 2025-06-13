import AsyncSelect, { AsyncProps } from "react-select/async";
import { forwardRef } from "react";

import "./InputSelect.css";

export default forwardRef<any, AsyncProps<any, any, any>>(
  function InputSelect(props, ref) {
    return <AsyncSelect className="input-select" {...props} ref={ref} />;
  }
);
