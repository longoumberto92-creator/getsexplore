"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface TravelContextValue {
  inputValue: string;
  setInputValue: (v: string) => void;
}

const TravelContext = createContext<TravelContextValue>({
  inputValue: "",
  setInputValue: () => {},
});

export function TravelProvider({ children }: { children: ReactNode }) {
  const [inputValue, setInputValue] = useState("");
  return (
    <TravelContext.Provider value={{ inputValue, setInputValue }}>
      {children}
    </TravelContext.Provider>
  );
}

export function useTravelContext() {
  return useContext(TravelContext);
}
