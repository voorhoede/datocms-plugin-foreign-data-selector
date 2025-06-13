import type { UniqueIdentifier } from "@dnd-kit/core";
import type { ForeignDataItem } from "../../types/ForeignDataItem";
import { HTMLAttributes } from "react";
import {useSortable} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BarsIcon from "../BarsIcon/BarsIcon";
import { Button } from "datocms-react-ui";
import clsx from "clsx";

import "./SelectedListItem.css";

type Props = {
  item: ForeignDataItem;
  removeItem: (item: ForeignDataItem) => void;
} & HTMLAttributes<HTMLLIElement>;

export default function List({ item, removeItem, ...props }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: props.id as UniqueIdentifier});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li className={clsx(
      "selected-list-item",
      { "selected-list-item--dragging": isDragging }
    )} ref={setNodeRef}  style={style} {...attributes}>
      <div>
        <BarsIcon className="selected-list-item__grab-handle" {...listeners} />
      </div>
      <div className="selected-list-item__content">
        {item.imageUrl && (
          <img className="selected-list-item__image" src={item.imageUrl} />
        )}
        <div className="selected-list-item__details">
          <h4 className="selected-list-item__title">{item.title}</h4>
          {item.description && (
            <p className="selected-list-item__description">{item.description}</p>
          )}
        </div>
        <div className="selected-list-item__actions">
          <Button onClick={() => removeItem(item)}>Remove</Button>
        </div>
      </div>
    </li>
  );


}
