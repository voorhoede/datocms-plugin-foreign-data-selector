import { HTMLAttributes } from "react";
import { ForeignDataItem } from "../../types/ForeignDataItem";
import { Button } from "datocms-react-ui";

import "./SelectedListItem.css";

type Props = {
  item: ForeignDataItem;
  removeItem: (item: ForeignDataItem) => void;
} & HTMLAttributes<HTMLLIElement>;

export default function List({ item, removeItem, ...props }: Props) {
  return (
    <li className="selected-list-item" {...props}>
      {item.imageUrl && (
        <img className="selected-list-item__image" src={item.imageUrl} />
      )}
      <div className="selected-list-item__details">
        <h4 className="selected-list-item__title">{item.title}</h4>
        {item.description && (
          <p className="selected-list-item__description">{item.description}</p>
        )}
      </div>
      <div>
        <Button onClick={() => removeItem(item)}>Remove</Button>
      </div>
    </li>
  );
}
