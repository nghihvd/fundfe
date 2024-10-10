import { useCallback, useEffect, useState } from "react";
import axios from "../services/axios";
import moment from 'moment';
import "../styles/notification.scss";

const Notification = ({ roleID }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

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
            
            if (response && response.data && response.data.data) {
                const notificationData = response.data.data;
                const processedNotifications = notificationData.map(noti => ({
                    ...noti,
                    isRead: localStorage.getItem(`noti_${noti.notiID}_read`) === 'true',
                    createdAt: noti.createdAt || noti.created_at || new Date().toISOString()
                }));
                
                processedNotifications.sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf());
                
                setNotifications(processedNotifications);
                setUnreadCount(processedNotifications.filter(noti => !noti.isRead).length);
            } else {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [roleID]);

    useEffect(() => {
        apiNotifications();
        const interval = setInterval(apiNotifications, 60000);
        return () => clearInterval(interval);
    }, [apiNotifications]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            markAllAsRead();
        }
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(noti => {
            if (!noti.isRead) {
                localStorage.setItem(`noti_${noti.notiID}_read`, 'true');
                return { ...noti, isRead: true };
            }
            return noti;
        });
        setNotifications(updatedNotifications);
        setUnreadCount(0);
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = moment(dateString);
        if (!date.isValid()) {
            console.error('Invalid date:', dateString);
            return 'Invalid Date';
        }
        
        const now = moment();
        const diffHours = now.diff(date, 'hours');
        
        if (diffHours < 24) {
            return date.fromNow();
        } else {
            return date.format('MMMM D, YYYY HH:mm');
        }
    };

    const parseDate = (dateString) => {
        // Ví dụ nếu backend gửi dạng "DD-MM-YYYY HH:mm:ss"
        return moment(dateString, "DD-MM-YYYY HH:mm:ss");
    };

    return (
        <div className="notification-bell">
            <i className="fa-solid fa-bell" onClick={toggleDropdown}></i>
            {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
            {showDropdown && (
                <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div key={index} className={`notification-item ${notification.isRead ? '' : 'unread'}`}>
                                <p>{notification.message}</p>
                                <p className="notification-date">
                                    {formatRelativeTime(notification.createdAt)}
                                </p>
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