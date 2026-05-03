import "./NotificationsDropdown.css";
import { useContext } from "react";
import NotificationsContext from "../../contexts/NotificationsContext";

function NotificationsDropdown({ isOpen, onClose }) {
  const { notifications, markAsRead, markAllAsRead, clearAll } =
    useContext(NotificationsContext);

  if (!isOpen) return null;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatAdministeredDateTime = (dateTimeString) => {
    if (!dateTimeString) return null;
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="notifications-dropdown">
      <div className="notifications-dropdown__header">
        <h3 className="notifications-dropdown__title">Notifications</h3>
        {notifications.length > 0 && (
          <div className="notifications-dropdown__actions">
            <button
              className="notifications-dropdown__action-btn"
              onClick={markAllAsRead}
            >
              Mark all read
            </button>
            <button
              className="notifications-dropdown__action-btn"
              onClick={clearAll}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      <div className="notifications-dropdown__content">
        {notifications.length === 0 ? (
          <div className="notifications-dropdown__empty">
            <p>No notifications</p>
          </div>
        ) : (
          <ul className="notifications-dropdown__list">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notifications-dropdown__item ${
                  !notification.read
                    ? "notifications-dropdown__item--unread"
                    : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notifications-dropdown__item-header">
                  <span className="notifications-dropdown__item-type">
                    PRN Alert
                  </span>
                  <span className="notifications-dropdown__item-time">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                <div className="notifications-dropdown__item-body">
                  <p className="notifications-dropdown__item-message">
                    {notification.message}
                  </p>
                  {notification.details && (
                    <>
                      <p className="notifications-dropdown__item-details">
                        <strong>Reason:</strong> {notification.details.reason}
                      </p>
                      {notification.details.administeredAt && (
                        <p className="notifications-dropdown__item-details">
                          <strong>Administered:</strong>{" "}
                          {formatAdministeredDateTime(
                            notification.details.administeredAt,
                          )}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotificationsDropdown;
