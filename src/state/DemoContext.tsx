"use client";

import { createContext, useContext } from "react";
import type { DemoState } from "@/src/types";

type DemoContextValue = {
  demoState: DemoState;
  setDemoState: (state: DemoState) => void;
};

export const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemoState() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemoState must be used inside DemoContext");
  return value;
}
