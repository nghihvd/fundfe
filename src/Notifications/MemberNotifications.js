import { useState, useCallback, useEffect } from 'react';
import axios from '../services/axios';
import "../styles/notification.scss";
const MemberNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    
    const apiMemberNotifications = useCallback(async () => {
        try{
            const response = await axios.get("notification/memberNoti");
            console.log("Full API response:", response.data);
            setNotifications(response.data.data || []);
        }catch(error){
            console.error("Error fetching notifications:", error);
            setNotifications([]);
        }
    }, []);
    
    useEffect(() => {
        apiMemberNotifications();
    }, [apiMemberNotifications]);
    return (
        <div className="member-notifications">
          <h2>Member Notifications</h2>
          {notifications.length > 0 ? (
            <ul className="notification-list">
              {notifications.map((noti) => (
                <li key={noti.id} className="notification-item">
                  <p>{noti.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications found.</p>
          )}
        </div>
    );
}

export default MemberNotifications;