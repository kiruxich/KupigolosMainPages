"use client";

import { useEffect } from "react";
import { mountHomeRuntime } from "@/lib/home/runtime-controller";

export function HomeRuntime() {
  useEffect(() => mountHomeRuntime(document), []);
  return null;
}

