import React, { useState, useEffect, useCallback } from "react";
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from "react-toastify";
import moment from "moment";
import Spinner from "../components/Spinner";

const RequestEventNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchEventNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/notification/showEventNoti");
      console.log("API Response:", response.data); // Thêm log này
      console.log("Full server response:", response);
      if (response.data && response.data.data) {
        const processedNotifications = response.data.data.map((noti) => {
          console.log(
            "Processing notification:",
            JSON.stringify(noti, null, 2)
          );
          return {
            ...noti,
            isNew: !localStorage.getItem(`event_noti_${noti.notiID}_read`),
          };
        });
        const newCount = processedNotifications.filter(
          (noti) => noti.isNew
        ).length;
        setNewNotificationsCount(newCount);
        setNotifications(processedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching event notifications:", error);
      setError("No notifications found");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventNotifications();
  }, [fetchEventNotifications]);

  const handleStatusUpdate = async (noti, status) => {
    const eventID = extractEventID(noti.message);
    if (!eventID) {
      console.error("EventID is undefined");
      toast.error("Cannot update event status: Invalid event ID");
      return;
    }
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `/events/${eventID}/status?status=${status}`
      );
      console.log("Status update response:", response);

      if (response.data) {
        const message = status
          ? "Event accepted successfully"
          : "Event rejected successfully";
        toast.success(message);
        localStorage.setItem(`event_noti_${noti.notiID}_read`, "true");
        await fetchEventNotifications(); // Gọi lại API để cập nhật danh sách
      } else {
        throw new Error(
          response.data.message || "Failed to update event status"
        );
      }
    } catch (error) {
      console.error("Error updating event status:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update event status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Date not available";
    const date = moment(dateString);
    if (!date.isValid()) return "Invalid Date";

    const now = moment();
    const diffHours = now.diff(date, "hours");

    if (diffHours < 24) {
      return date.fromNow();
    } else {
      return date.format("MMMM D, YYYY HH:mm");
    }
  };

  const formatMessage = (message) => {
    const lines = message.split("\n");
    const columnLength = Math.ceil(lines.length / 3);
    return (
      <div className="notification-message-container">
        <div className="notification-message-column">
          {lines.slice(0, columnLength).join("\n")}
        </div>
        <div className="notification-message-column">
          {lines.slice(columnLength, 2 * columnLength).join("\n")}
        </div>
        <div className="notification-message-column">
          {lines.slice(2 * columnLength).join("\n")}
        </div>
      </div>
    );
  };

  const extractEventID = (message) => {
    const match = message.match(/ID: (\w+)/);
    return match ? match[1] : null;
  };

  if (isLoading || isUpdating) {
    return <Spinner />;
  }

  return (
    <div className="admin-notifications">
      <div className="notifications-content">
        <h2>
          Event Request Notifications{" "}
          {newNotificationsCount > 0 && (
            <span className="notification-count">
              ({newNotificationsCount})
            </span>
          )}
        </h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((noti) => (
              <li
                key={noti.notiID}
                className={`notification-item ${noti.isNew ? "new" : ""}`}
              >
                {formatMessage(noti.message)}
                <p className="notification-date">
                  {formatRelativeTime(noti.createdAt)}
                </p>
                {noti.button_status && (
                  <div className="notification-actions">
                    <button
                      onClick={() => handleStatusUpdate(noti, true)}
                      disabled={isUpdating}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(noti, false)}
                      disabled={isUpdating}
                    >
                      Deny
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No event notifications found</p>
        )}
      </div>
    </div>
  );
};

export default RequestEventNotifications;