import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import axios, { BASE_URL } from "../services/axios";
import { toast } from 'react-toastify';
const Report =() =>{
    const location = useLocation();
    const pet = location.state?.pet;
    const petID = pet.petID;
    const videoRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const recordingDuration = 7000; // Thời gian quay cố định (5 giây)
    let mediaRecorder;
    let chunks = [];
  
    // Hàm bắt đầu ghi hình và hiển thị video
    const startRecording = async () => {
      try {
        // Truy cập camera và microphone của người dùng
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  
        // Gán stream vào video element để hiển thị
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
  
        // Bắt đầu ghi hình
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (event) {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
  
        mediaRecorder.onstop = function () {
          const blob = new Blob(chunks, { type: 'video/webm' });
          chunks = [];
  
          // Gửi video lên server
          const formData = new FormData();
          formData.append('videoFile', blob, 'recorded-video.webm');
  
          axios.post(`${BASE_URL}pets/report/${petID}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
            .then(response => {
                toast.success(response.data.message);
              
            })
            .catch(error => {
              console.error('There was an error uploading the video:', error);
              toast.error(error.response.data.message);
            });
  
          // Dừng stream để tắt camera sau khi ghi xong
          if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }
  
          setIsRecording(false);
        };
  
        mediaRecorder.start();
        setIsRecording(true);
  
        // Cố định thời gian quay và tự động dừng sau khi hết thời gian
        setTimeout(() => {
          mediaRecorder.stop();
        }, recordingDuration); // Dừng sau recordingDuration ms (5 giây)
  
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
  
    return (
      <div>
        {/* Video element để hiển thị luồng video trực tiếp */}
        <video ref={videoRef} style={{ width: '500px', height: '400px' }} autoPlay muted></video>
        <br />
        {/* Nút bắt đầu quay video */}
        <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      </div>
    );
  };

export default Report;