import React, { useState, useEffect, useCallback } from 'react';
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from 'react-toastify';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState("other");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const apiAdminNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            let response;
            if (activeTab === "other") {
                response = await axios.get("/notification/otherAdminNoti");
            } else if (activeTab === "addPet") {
                response = await axios.get("/notification/showAdminAdoptNoti");
            } else if (activeTab === "requestRegister") {
                response = await axios.get("/notification/showRegisNoti");
            }
            
            console.log('API Response:', response);

            if (response.status === 200) {
                const data = response.data.data || response.data;
                setNotifications(Array.isArray(data) ? data : []);
            } else {
                setNotifications([]);
                setError('No notifications found');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                    case 404:
                        setError(error.response.data || 'No notifications found');
                        break;
                    default:
                        setError('An error occurred. Please try again later.');
                }
            } else if (error.request) {
                setError('No response received from the server. Please check your connection.');
            } else {
                setError('Error setting up the request. Please try again.');
            }
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        apiAdminNotifications();
    }, [apiAdminNotifications]);

    const HandleStatusUpdate = async (notiID, status) => {
        try {
            console.log(`Updating notification ${notiID} with status ${status}`);
            const response = await axios.put(`notification/${notiID}/status?status=${status}`);
            console.log('Update response:', response);
            if (response.status === 200) {
                if (response.data === "Delete pet and notification") {
                    toast.success("Pet and notification deleted successfully");
                } else {
                    toast.success(`Notification ${status ? 'Accepted' : 'Denied'} successfully`);
                }
                apiAdminNotifications();
            }
        } catch (error) {
            console.error('Error updating notification status:', error);
            toast.error('Failed to update notification status');
        }
    }

    return (
        <div className="admin-notifications">
            <div className="sidebar-notifications">
                <h2>Notifications</h2>
                <ul>
                    <li
                        className={activeTab === 'other' ? 'active' : ''}
                        onClick={() => setActiveTab('other')}
                    >
                        Other
                    </li>
                    <li
                        className={activeTab === 'addPet' ? 'active' : ''}
                        onClick={() => setActiveTab('addPet')}
                    >
                        Add Pet
                    </li>
                    <li
                        className={activeTab === 'requestRegister' ? 'active' : ''}
                        onClick={() => setActiveTab('requestRegister')}
                    >
                        Request Register
                    </li>
                </ul>
            </div>
            <div className="notifications-content">
                <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : notifications.length > 0 ? (
                    <ul className="notification-list">
                        {notifications.map((noti) => (
                            <li key={noti.notiID} className="notification-item">
                                <p>{noti.message}</p>
                                {(activeTab === 'addPet' || activeTab === 'requestRegister') && noti.button_status && (
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

export default AdminNotifications;
