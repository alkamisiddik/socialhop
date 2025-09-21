"use client";
import { useState } from "react";
import { SettingsContext } from "./settings-context";

export function SettingsContextProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState({
    theme: "dark",
    isSidebarOpen: false,
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
