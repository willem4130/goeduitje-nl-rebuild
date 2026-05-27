"use client";

import { useEffect, useRef } from "react";

import {
  trackBeginCheckout,
  trackViewItem,
  trackViewItemList,
  type AnalyticsItem,
} from "@/lib/analytics";

// Declarative drop-in trackers for Server Components. They fire once on mount
// (per unique key) using useEffect, so it's safe to render them at the top of
// any page or wrap them around interactive children.

export function TrackViewItem({
  item,
  trackingKey,
}: {
  item: AnalyticsItem;
  trackingKey?: string;
}) {
  const firedRef = useRef(false);
  const key = trackingKey ?? item.item_id;

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackViewItem(item);
    // We intentionally depend only on `key` so re-renders with the same item
    // don't refire the event. The item object reference may change while the
    // logical item is the same.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}

export function TrackViewItemList({
  items,
  listName,
  listId,
  trackingKey,
}: {
  items: AnalyticsItem[];
  listName: string;
  listId?: string;
  trackingKey?: string;
}) {
  const firedRef = useRef(false);
  const key = trackingKey ?? listName;

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackViewItemList(items, listName, listId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}

export function TrackBeginCheckout({
  items,
  value,
  trackingKey,
}: {
  items: AnalyticsItem[];
  value: number;
  trackingKey?: string;
}) {
  const firedRef = useRef(false);
  const key = trackingKey ?? "begin_checkout";

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackBeginCheckout(items, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
