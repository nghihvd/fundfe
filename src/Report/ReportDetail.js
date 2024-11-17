import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import "../styles/ReportDetail.scss";
const ReportDetail = () => {
  const location = useLocation();
  const [pet, setPet] = useState(location.state?.pet);

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/report/getPetReports/${pet.petID}`);
        setReports(response.data.data);
        setVideo(response.data.data[0]?.video);
        console.log(response.data.data);
      } catch (error) {
        toast.error("Error fetching report history");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [pet.petID]);

  const getImageUrl = useCallback((img_url) => {
    if (img_url.startsWith("http")) return img_url;
    return `http://localhost:8081/${img_url.replace(/\\/g, "/")}`;
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const videoSrc = video ? `data:video/webm;base64,${video}` : null;

  const groupedReports = reports.reduce((acc, report) => {
    const month = new Date(report.date_report).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(report);
    return acc;
  }, {});

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 5, padding: "20px" }}>
        <h2>Pet Information</h2>
        <div className="pet-info-report">
          <div className="pet-image-report">
            <img
              src={getImageUrl(pet.img_url)}
              alt={pet.name}
              className="img-report"
            />
          </div>
          <div className="pet-details">
            <p>
              <strong>Name: </strong> {pet.name}
            </p>
            <p>
              <strong>Breed: </strong> {pet.breed}
            </p>
            <p>
              <strong>Age: </strong> {pet.age} month
            </p>
            <p>
              <strong>Sex: </strong> {pet.sex}
            </p>
            <p>
              <strong>Weight: </strong> {pet.weight}kg
            </p>
          </div>
        </div>
      </div>
      <div style={{ flex: 7, padding: "60px" }}>
        {Object.keys(groupedReports).length === 0 ? (
          <p>No reports found.</p>
        ) : (
          Object.entries(groupedReports).map(([month, reports]) => (
            <div key={month}>
              <h3>{month}</h3>
              <ul>
                {reports.map((report) => (
                  <li key={report.id}>
                    <h4>Date of report: {formatDate(report.date_report)}</h4>
                    <video
                      src={videoSrc}
                      controls
                      style={{ width: "300px", height: "200px" }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportDetail;
