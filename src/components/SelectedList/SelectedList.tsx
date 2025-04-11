import { HTMLAttributes } from "react";

import "./SelectedList.css";

type Props = {} & HTMLAttributes<HTMLUListElement>;

export default function SelectedList({ ...props }: Props) {
  return <ul className="selected-list" {...props}></ul>;
}
