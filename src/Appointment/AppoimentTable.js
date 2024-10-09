import React, { useState, useEffect, useCallback } from "react";
import axios from "../services/axios";
import "../styles/appoitment.scss";
import moment from "moment";
import { toast } from "react-toastify";

const AppointmentPage = () => {
  // Các state để lưu trữ và quản lý dữ liệu
  const [unprocessedAppointments, setUnprocessedAppointments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [processingAppointments, setProcessingAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("unprocessed");
  const [showModal, setShowModal] = useState(false);
  const [refusalReason, setRefusalReason] = useState("");
  const [appointmentToRefuse, setAppointmentToRefuse] = useState(null);
  const [notHappenAppointments, setNotHappenAppointments] = useState([]);
  const [endedAppointments, setEndedAppointments] = useState([]);

  // Lấy thông tin người dùng hiện tại từ localStorage
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUser(user);
    }
  }, []);

  // Lấy danh sách cuộc hẹn chưa xử lý
  const apiUnprocessedAppointments = useCallback(async () => {
    try {
      const response = await axios.get("appointment/showUnprocessed");
      setUnprocessedAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching unprocessed appointments:", error);

      setUnprocessedAppointments([]);
    }
  }, []);
  // Lấy danh sách cuộc hẹn đang chờ gặp mặt
  const apiNotHappenAppointments = useCallback(async () => {
    try {
      const response = await axios.get("appointment/showNotHappenedYet");
      setNotHappenAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching not happen appointments:", error);
      setNotHappenAppointments([]);
    }
  }, []);
  // Lấy danh sách cuộc hẹn kết thúc
  const apiEndedAppointments = useCallback(async () => {
    try {
      const response = await axios.get("appointment/showEnded");
      setEndedAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching ended appointments:", error);
      setEndedAppointments([]);
    }
  }, []);

  // Làm mới danh sách cuộc hẹn theo tab hiện tại
  const refreshAppointments = useCallback(async () => {
    if (activeTab === "unprocessed") {
      await apiUnprocessedAppointments();
    } else if (activeTab === "notHappenYet") {
      await apiNotHappenAppointments();
    } else if (activeTab === "ended") {
      await apiEndedAppointments();
    }
  }, [
    activeTab,
    apiUnprocessedAppointments,
    apiNotHappenAppointments,
    apiEndedAppointments,
  ]);

  // Gọi làm mới khi tab thay đổi
  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  // Xử lý chấp nhận cuộc hẹn ở bảng unprocessed
  const acceptAppointment = async (appointmentId) => {
    if (processingAppointments.includes(appointmentId)) {
      toast.error("This appointment is already being processed.");
      return;
    }
    setProcessingAppointments((prev) => [...prev, appointmentId]);
    try {
      const staffId = currentUser.accountID;
      const response = await axios.put(`/appointment/accept/${staffId}`, {
        appointID: appointmentId,
      });

      setUnprocessedAppointments((prev) =>
        prev.filter((app) => app.appointID !== appointmentId)
      );
      toast.success(response.data.message);
      refreshAppointments();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error accepting appointment:", error);
    } finally {
      setProcessingAppointments((prev) =>
        prev.filter((id) => id !== appointmentId)
      );
    }
  };

  // Xử lý từ chối cuộc hẹn ở bảng unprocessed
  const refuseAppointment = (appointmentId) => {
    if (processingAppointments.includes(appointmentId)) {
      toast.error("This appointment is already being processed.");
      return;
    }
    setAppointmentToRefuse(appointmentId);
    setShowModal(true);
  };

  // Xử lý khi submit lý do từ chối
  const handleRefusalSubmit = async () => {
    if (!refusalReason.trim()) {
      toast.error("Please provide a reason for refusal.");
      return;
    }
    setProcessingAppointments((prev) => [...prev, appointmentToRefuse]);
    try {
      const response = await axios.delete(
        `/appointment/refuse/${refusalReason}`,
        {
          data: { appointID: appointmentToRefuse },
        }
      );
      setUnprocessedAppointments((prev) =>
        prev.filter((app) => app.appointID !== appointmentToRefuse)
      );
      toast.success(response.data.message);
      refreshAppointments();
    } catch (error) {
      toast.error(error.response.data.message);

      console.error(
        "Error refusing appointment:",
        error.response?.data || error.message
      );
    } finally {
      setProcessingAppointments((prev) =>
        prev.filter((id) => id !== appointmentToRefuse)
      );
      setShowModal(false);
      setRefusalReason("");
      setAppointmentToRefuse(null);
    }
  };
  // Xử lý chấp nhận cuộc hẹn ở bảng notHappenyet
  const handleFinalAccept = async (appointmentId) => {
    setProcessingAppointments((prev) => [...prev, appointmentId]);
    try {
      const response = await axios.put(`/appointment/acceptAdopt`, {
        appointID: appointmentId,
      });
      toast.success(response.data.message);
      refreshAppointments();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error final accepting appointment:", error);
    }
  };
  // Xử lý từ chối cuộc hẹn ở bảng notHappenyet
  const handleFinalRefuse = async (appointmentId) => {
    setProcessingAppointments((prev) => [...prev, appointmentId]);
    try {
      const response = await axios.delete(`/appointment/refuseAdopt`, {
        data: { appointID: appointmentId },
      });
      toast.success(response.data.message);
      refreshAppointments();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error final refusing appointment:", error);
    }
  };
  // Format ngày giờ
  const formatDateTime = (dateTimeString) => {
    return moment(dateTimeString).format("YYYY-MM-DD HH:mm:ss");
  };

  const renderStatus = (status) =>
    status === true ? "Processed" : "Unprocessed";

  const renderAdoptStatus = (adoptStatus) => {
    if (adoptStatus === undefined) return "Not set";
    return adoptStatus === true ? "Adopted" : "Not yet";
  };

  return (
    <div className="appointment-container">
      <div className="sidebar-appointment">
        <h2>Appointments</h2>
        <ul>
          <li
            className={activeTab === "unprocessed" ? "active" : ""}
            onClick={() => {
              setActiveTab("unprocessed");
              apiUnprocessedAppointments();
            }}
          >
            Unprocessed
          </li>
          <li
            className={activeTab === "notHappenYet" ? "active" : ""}
            onClick={() => {
              setActiveTab("notHappenYet");
              apiNotHappenAppointments();
            }}
          >
            Not Happened Yet
          </li>
          <li
            className={activeTab === "ended" ? "active" : ""}
            onClick={() => {
              setActiveTab("ended");
              apiEndedAppointments();
            }}
          >
            Ended
          </li>
        </ul>
      </div>

      <div className="main-content">
        {activeTab === "unprocessed" && (
          <>
            {unprocessedAppointments.length > 0 ? (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Date Time</th>
                    <th>Account ID</th>
                    <th>Pet ID</th>
                    <th>Status</th>
                    <th>Adopt Status</th>
                    <th>Button</th>
                  </tr>
                </thead>
                <tbody>
                  {unprocessedAppointments.map((appointment) => (
                    <tr key={appointment.appointID}>
                      <td>{formatDateTime(appointment.date_time)}</td>
                      <td>{appointment.accountID}</td>
                      <td>{appointment.petID}</td>
                      <td>{renderStatus(appointment.status)}</td>
                      <td>{renderAdoptStatus(appointment.adopt_status)}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            acceptAppointment(appointment.appointID)
                          }
                          disabled={processingAppointments.includes(
                            appointment.appointID
                          )}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            refuseAppointment(appointment.appointID)
                          }
                          disabled={processingAppointments.includes(
                            appointment.appointID
                          )}
                        >
                          Refuse
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-appointments">
                No unprocessed appointments found.
              </p>
            )}
          </>
        )}

        {activeTab === "notHappenYet" && (
          <>
            {notHappenAppointments.length > 0 ? (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Date Time</th>
                    <th>Account ID</th>
                    <th>Pet ID</th>
                    <th>Staff ID</th>
                    <th>Status</th>
                    <th>Adopt Status</th>
                    <th>Button</th>
                  </tr>
                </thead>
                <tbody>
                  {notHappenAppointments.map((appointment) => (
                    <tr key={appointment.appointID}>
                      <td>{formatDateTime(appointment.date_time)}</td>
                      <td>{appointment.accountID}</td>
                      <td>{appointment.petID}</td>
                      <td>{appointment.staffID}</td>
                      <td>{renderStatus(appointment.status)}</td>
                      <td>{renderAdoptStatus(appointment.adopt_status)}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleFinalAccept(appointment.appointID)
                          }
                          disabled={processingAppointments.includes(
                            appointment.appointID
                          )}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleFinalRefuse(appointment.appointID)
                          }
                          disabled={processingAppointments.includes(
                            appointment.appointID
                          )}
                        >
                          Refuse
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-appointments">
                No not happened yet appointments found.
              </p>
            )}
          </>
        )}
        {activeTab === "ended" && (
          <>
            {endedAppointments.length > 0 ? (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Date Time</th>
                    <th>Account ID</th>
                    <th>Pet ID</th>
                    <th>Staff ID</th>
                    <th>Status</th>
                    <th>Adopt Status</th>
                  </tr>
                </thead>
                <tbody>
                  {endedAppointments.map((appointment) => (
                    <tr key={appointment.appointID}>
                      <td>{formatDateTime(appointment.date_time)}</td>
                      <td>{appointment.accountID}</td>
                      <td>{appointment.petID}</td>
                      <td>{appointment.staffID}</td>
                      <td>{renderStatus(appointment.status)}</td>
                      <td>{renderAdoptStatus(appointment.adopt_status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-appointments">No ended appointments found.</p>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="appointment-refusal-modal">
          <div className="modal-content">
            <h2>Refuse Appointment</h2>
            <textarea
              value={refusalReason}
              onChange={(e) => setRefusalReason(e.target.value)}
              placeholder="Enter reason for refusal"
            />
            <div className="modal-buttons">
              <button onClick={handleRefusalSubmit}>Submit</button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRefusalReason("");
                  setAppointmentToRefuse(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
