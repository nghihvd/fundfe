import React, { useState, useEffect, useCallback } from 'react';
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from 'react-toastify';
import moment from 'moment';
import Spinner from "../components/Spinner";

const AddPetNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newNotificationsCount, setNewNotificationsCount] = useState(0);

    const apiAddPetNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("/notification/showAdminAdoptNoti");
            if (response.data && Array.isArray(response.data)) {
                const processedNotifications = response.data.map(noti => ({
                    ...noti,
                    isNew: !localStorage.getItem(`noti_${noti.notiID}_read`)
                }));
                const newCount = processedNotifications.filter(noti => noti.isNew).length;
                setNewNotificationsCount(newCount);
                setNotifications(processedNotifications);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (error.response && error.response.status === 400) {
                setError(error.response.data || 'No adopt notifications found');
            } else {
                setError('An error occurred. Please try again later.');
            }
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        apiAddPetNotifications();
    }, [apiAddPetNotifications]);

    const HandleStatusUpdate = async (notiID, status) => {
        try {
            const response = await axios.put(`notification/${notiID}/status?status=${status}`);
            if (response.status === 200) {
                toast.success(`Notification ${status ? 'Accepted' : 'Denied'} successfully`);
                localStorage.setItem(`noti_${notiID}_read`, 'true');
                apiAddPetNotifications();
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

    const formatMessage = (message) => {
        const lines = message.split('\n');
        const columnLength = Math.ceil(lines.length / 3);
        return (
            <div className="notification-message-container">
                <div className="notification-message-column">
                    {lines.slice(0, columnLength).join('\n')}
                </div>
                <div className="notification-message-column">
                    {lines.slice(columnLength, 2 * columnLength).join('\n')}
                </div>
                <div className="notification-message-column">
                    {lines.slice(2 * columnLength).join('\n')}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="admin-notifications">
            <div className="notifications-content">
                <h2>Add Pet Notifications {newNotificationsCount > 0 && <span className="notification-count">({newNotificationsCount})</span>}</h2>
                {error ? (
                    <p className="error-message">{error}</p>
                ) : notifications.length > 0 ? (
                    <ul className="notification-list">
                        {notifications.map((noti) => (
                            <li key={noti.notiID} className={`notification-item ${noti.isNew ? 'new' : ''}`}>
                                {formatMessage(noti.message)}
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
                    <p>No adopt notifications found</p>
                )}
            </div>            
        </div>
    );
};

export default AddPetNotifications;