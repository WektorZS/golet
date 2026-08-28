"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type SortableItem = {
  id: number
}

function SortableCard({
  id,
  children,
}: {
  id: number
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab touch-none active:cursor-grabbing"
    >
      {children}
    </div>
  )
}

export function SortableGallery({
  initialItems,
  scope,
  children,
}: {
  initialItems: SortableItem[]
  scope: "global" | "trip"
  children: (item: SortableItem) => React.ReactNode
}) {
  const [items, setItems] = useState(initialItems)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)

    const newItems = arrayMove(items, oldIndex, newIndex)

    setItems(newItems)

    const formData = new FormData()

    formData.append(
      "items",
      JSON.stringify(
        newItems.map((item, index) => ({
          id: item.id,
          sortOrder: index,
        }))
      )
    )

    formData.append("scope", scope)

    await fetch("/api/admin/reorder-gallery", {
      method: "POST",
      body: formData,
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        {items.map((item) => (
          <SortableCard key={item.id} id={item.id}>
            {children(item)}
          </SortableCard>
        ))}
      </SortableContext>
    </DndContext>
  )
}