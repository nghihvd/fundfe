import React, { useState, useEffect, useCallback } from 'react';
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from 'react-toastify';
import moment from 'moment';

const RequestRegisterNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newNotificationsCount, setNewNotificationsCount] = useState(0);

    const apiRequestRegisterNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("/notification/showRegisNoti");
            console.log("API Response:", response.data); // Log the response

            // Check if response.data is an object with a 'data' property
            const notificationData = response.data.data || response.data;

            // Ensure notificationData is an array
            const processedNotifications = Array.isArray(notificationData) 
                ? notificationData.map(noti => ({
                    ...noti,
                    isNew: !localStorage.getItem(`noti_${noti.notiID}_read`)
                  }))
                : [];

            const newCount = processedNotifications.filter(noti => noti.isNew).length;
            setNewNotificationsCount(newCount);

            setNotifications(processedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error.response || error);
            setError('An error occurred. Please try again later.');
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        apiRequestRegisterNotifications();
    }, [apiRequestRegisterNotifications]);

    const HandleStatusUpdate = async (notiID, status) => {
        try {
            const response = await axios.put(`notification/${notiID}/status?status=${status}`);
            if (response.status === 200) {
                toast.success(`Notification ${status ? 'Accepted' : 'Denied'} successfully`);
                localStorage.setItem(`noti_${notiID}_read`, 'true');
                apiRequestRegisterNotifications();
            }
        } catch (error) {
            console.error('Error updating notification status:', error);
            toast.error('Failed to update notification status');
        }
    }

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = moment(dateString);
        if (!date.isValid()) return 'Invalid Date';
        
        const now = moment();
        const diffHours = now.diff(date, 'hours');
        
        if (diffHours < 24) {
            return date.fromNow();
        } else {
            return date.format('MMMM D, YYYY HH:mm');
        }
    };

    return (
        <div className="admin-notifications">
            <div className="notifications-content">
                <h2>Request Register Notifications {newNotificationsCount > 0 && <span className="notification-count">({newNotificationsCount})</span>}</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : notifications.length > 0 ? (
                    <ul className="notification-list">
                        {notifications.map((noti) => (
                            <li key={noti.notiID} className={`notification-item ${noti.isNew ? 'new' : ''}`}>
                                <p>{noti.message}</p>
                                <p className="notification-date">
                                    {formatRelativeTime(noti.createdAt)}
                                </p>
                                {noti.button_status && (
                                    <div className="notification-actions">
                                        <button onClick={() => HandleStatusUpdate(noti.notiID, true)}>Accept</button>
                                        <button onClick={() => HandleStatusUpdate(noti.notiID, false)}>Deny</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notifications found</p>
                )}
            </div>            
        </div>
    );
};

export default RequestRegisterNotifications;