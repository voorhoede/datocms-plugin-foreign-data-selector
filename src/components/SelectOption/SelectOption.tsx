import type { SelectOption as SelectOptionType } from "../../types/selectOption";

import "./SelectOption.css";

type Props = {
  option: SelectOptionType;
};

export default function SelectOption({ option }: Props) {
  return (
    <div className="select-option">
      {option.data.imageUrl && <img className="select-option__image" src={option.data.imageUrl} />}
      <div className="select-option__content">
        <h4 className="select-option__title">{option.data.title}</h4>
        {option.data.description && <p className="select-option__description">{option.data.description}</p>}
      </div>
    </div>
  );
}
