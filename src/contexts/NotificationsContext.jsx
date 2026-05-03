import { createContext } from "react";

const NotificationsContext = createContext({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAll: () => {},
});

export default NotificationsContext;
