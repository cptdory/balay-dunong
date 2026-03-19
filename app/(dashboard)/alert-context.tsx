"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type AlertType = {
  message: string;
  variant: "default" | "destructive" | "success" | "info";
  title: string;
};

type AlertContextType = {
  alert: AlertType | null;
  setAlert: (alert: AlertType | null) => void;
  showAlert: (alert: AlertType) => void;
  clearAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertType | null>(null);

  const showAlert = useCallback((newAlert: AlertType) => {
    setAlert(newAlert);
  }, []);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, setAlert, showAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
}
