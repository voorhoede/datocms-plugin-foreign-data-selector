import { useState, type HTMLAttributes } from "react";
import type { ForeignDataItem } from "../../types/ForeignDataItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { clsx } from "clsx";

import "./SelectedList.css";

type Props = {
  items: ForeignDataItem[];
  handleDragEnd?: (value: ForeignDataItem[]) => void;
} & HTMLAttributes<HTMLUListElement>;

export default function SelectedList({
  items,
  handleDragEnd,
  ...props
}: Props) {
  const [dragging, setDragging] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragStart() {
    setDragging(true);
  }

  function onDragEnd(event: DragEndEvent) {
    setDragging(false);
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      const newArray = arrayMove(items, oldIndex, newIndex);
      handleDragEnd?.(newArray);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}

    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul
          className={clsx("selected-list", {
            "selected-list--dragging": dragging,
          })}
          {...props}
        />
      </SortableContext>
    </DndContext>
  );
}
