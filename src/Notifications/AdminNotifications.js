import React, { useCallback, useEffect, useState } from 'react';
import axios from "../services/axios";
import "../styles/adminpage.scss";
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
                response = await axios.get("/notification/otherAdminNoti", { withCredentials: true });
            } else if (activeTab === "addPet") {
                response = await axios.get("/notification/showAdminAdoptNoti", { withCredentials: true });
            } else if (activeTab === "requestRegister") {
                response = await axios.get("/notification/showRegisNoti", { withCredentials: true });
            }
            setNotifications(response.data.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (error.response && error.response.status === 404) {
                setError('Session expired or no notifications found. Please try logging in again.');
            } else {
                setError('Failed to fetch notifications. Please try again later.');
            }
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await apiAdminNotifications();
            } catch (error) {
                console.error('Error in useEffect:', error);
            }
        };
        fetchData();
    }, [apiAdminNotifications]);

    const HandleStatusUpdate = async (notiID, status) => {
        try {
            const response = await axios.put(`notification/${notiID}/status?status=${status}`);
            if (response.status === 200) {
                if (response.data === "Delete pet and notification") {
                    console.log("Pet and notification deleted");
                } else {
                    console.log(`Notification ${status ? 'Accepted' : 'Denied'} successfully`);
                }
                apiAdminNotifications();
            }
        } catch (error) {
            console.error('Error updating notification status:', error);
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
                {notifications.length > 0 ? (
                    <ul className="notification-list">
                        {notifications.map((noti) => (
                            <li key={noti.id} className="notification-item">
                                <p>{noti.message}</p>
                                {(activeTab === 'addPet' || activeTab === 'requestRegister') && (
                                    <div className="notification-actions">
                                        <button onClick={() => HandleStatusUpdate(noti.id, true)}>Accept</button>
                                        <button onClick={() => HandleStatusUpdate(noti.id, false)}>Deny</button>
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
