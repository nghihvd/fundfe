import React, { useCallback, useEffect, useState } from 'react';
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
                response = await axios.get("/notification/otherAdminNoti", { withCredentials: true });
            } else if (activeTab === "addPet") {
                response = await axios.get("/notification/showAdminAdoptNoti", { withCredentials: true });
            } else if (activeTab === "requestRegister") {
                response = await axios.get("/notification/showRegisNoti", { withCredentials: true });
            }
            
            if (response.status === 200) {
                // Kiểm tra cấu trúc dữ liệu trả về
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
                        setError(error.response.data || 'No notifications found');
                        break;
                    case 401:
                        setError('Unauthorized. Please log in again.');
                        // Có thể thêm logic chuyển hướng đến trang đăng nhập ở đây
                        break;
                    case 404:
                        setError('No notifications found');
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
            const response = await axios.put(`notification/${notiID}/status?status=${status}`);
            if (response.status === 200) {
                toast.success(`Notification ${status ? 'Accepted' : 'Denied'} successfully`);
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
