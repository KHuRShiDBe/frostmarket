"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

export default function RecordRecentlyViewed({ productId }: { productId: string }) {
  const { recordView } = useRecentlyViewed();

  useEffect(() => {
    recordView(productId);
  }, [productId, recordView]);

  return null;
}
