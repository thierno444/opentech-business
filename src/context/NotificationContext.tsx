import React, { createContext, useContext, useState, ReactNode } from "react";
import { Notification } from "../components/Notification";

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Array<{ id: number; type: "success" | "error" | "info"; message: string }>>([]);

  const addNotification = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (message: string) => addNotification("success", message);
  const showError = (message: string) => addNotification("error", message);
  const showInfo = (message: string) => addNotification("info", message);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <div className="fixed bottom-8 right-8 z-50 space-y-4">
        {notifications.map(notif => (
          <Notification
            key={notif.id}
            type={notif.type}
            message={notif.message}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}