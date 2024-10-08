import React, { useCallback, useEffect, useState } from 'react';
import axios from "../services/axios";
import "../styles/notification.scss";
const StaffNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    const apiStaffNotifications = useCallback(async () => {
        try {
            const response = await axios.get("notification/showStaffNoti");
            console.log("Full API response:", response.data);
            setNotifications(response.data.data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
        }
    }, []);
    useEffect(() => {
        apiStaffNotifications();
    }, [apiStaffNotifications]);
    return (
        <div className='staff-notifications'>
            <h1>Staff Notifications</h1>
            {notifications.length > 0 ?(
                <ul className='notification-list'>
                    {notifications.map((noti) => (
                        <li key={noti.id} className='notification-item'>
                            <p>{noti.message}</p>
                        </li>
                    ))}
                </ul>
            ):(
                <p>No notifications found</p>
            )}
        </div>
    )
}

export default StaffNotifications;
