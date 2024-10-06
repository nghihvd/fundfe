import { useCallback, useEffect, useState } from "react";
import axios from "../services/axios";
import "../styles/notification.scss";

const Notification = ({ roleID }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const apiNotifications = useCallback(async () => {
        try {
            let response;
            if (roleID === "1") {
                response = await axios.get("notification/otherAdminNoti");
            } else if (roleID === "2") {
                response = await axios.get("notification/showStaffNoti");
            } else if (roleID === "3") {
                response = await axios.get("notification/memberNoti");
            }
            console.log("API response:", response); // Log để kiểm tra response

            // Kiểm tra cấu trúc dữ liệu và set notifications
            if (response.data && response.data.data) {
                setNotifications(response.data.data);
            } else {
                console.error("Unexpected response structure:", response);
                setNotifications([]);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
        }
    }, [roleID]);

    useEffect(() => {
        apiNotifications();
        const interval = setInterval(apiNotifications, 60000);
        return () => clearInterval(interval);
    }, [apiNotifications]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="notification-bell">
            <i className="fa-solid fa-bell" onClick={toggleDropdown}></i>
            {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
            {showDropdown && (
                <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div key={index} className="notification-item">
                                {notification.message}
                            </div>
                        ))
                    ) : (
                        <div className="notification-item">No new notifications</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;