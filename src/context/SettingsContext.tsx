"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StoreSettings } from "@/types";
import { initialStoreSettings } from "@/data/initialData";
import { getStoreSettings, saveStoreSettings } from "@/lib/db";

interface SettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(initialStoreSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await getStoreSettings();
      if (data) {
        setSettings(data);
      }
    } catch (e) {
      console.error("Failed to load store settings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (partial: Partial<StoreSettings>): Promise<StoreSettings> => {
    const updated = {
      ...settings,
      ...partial,
      topBanner: {
        ...settings.topBanner,
        ...(partial.topBanner || {}),
      },
      hero: {
        ...settings.hero,
        ...(partial.hero || {}),
      },
      posters: partial.posters !== undefined ? partial.posters : settings.posters,
    };

    setSettings(updated);
    try {
      await saveStoreSettings(updated);
    } catch (err) {
      console.error("Failed to persist store settings", err);
    }
    return updated;
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

