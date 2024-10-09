import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import axios, { BASE_URL } from "../services/axios";
import "../styles/petdetail.scss";
import Carousel from "react-multi-carousel";

import { toast } from "react-toastify";

const PetDetail = () => {
  // Giả sử bạn có một hàm để lấy thông tin thú cưng theo petID
  const navigate = useNavigate();
  const [otherPets, setOtherPets] = useState([]); // Khởi tạo là mảng rỗng
  //const [videoSrc, setVideoSrc] = useState(null); // State để lưu URL video
  const location = useLocation(); // Lấy location
  const pet = location.state?.pet;
  console.log("Pet data:", pet); // Kiểm tra dữ liệu
  const roleID = localStorage.getItem("roleID");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleAdopt = (pet) => {
    if (pet.petID) {
      navigate(`/adoptprocess/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefined");
    }
  };

  const handleReport = (pet) => {
    if (pet.petID) {
      navigate(`/report/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefined");
    }
  };
  const handleRemind = async () => {
    try {
      const response = await axios.post(`notification/remindReport`, {
        petID: pet.petID,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  const handleBanRequest = async () => {
    try {
      const response = await axios.post(
        `notification/banRequest/${localStorage.getItem("accountID")}`,
        {
          petID: pet.petID,
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5, // Số lượng item hiển thị trên màn hình lớn
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3, // Số lượng item hiển thị trên màn hình desktop
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2, // Số lượng item hiển thị trên màn hình tablet
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1, // Số lượng item hiển thị trên màn hình mobile
    },
  };
  // Hàm để lấy dữ liệu thú cưng khác
  const fetchOtherPets = async () => {
    try {
      const response = await axios.get("/pets/showListOfPets");
      setOtherPets(response.data);
    } catch (error) {
      console.error("Error fetching other pets:", error);
    }
  };

  useEffect(() => {
    fetchOtherPets();
  }, []);

  const videoSrc = `data:video/webm;base64,${pet.video_report}`;

  const handleUpdatePet = () => {
    if (pet.petID) {
      navigate(`/petupdate/${pet.petID}`); // Chuyển hướng đến trang cập nhật
    } else {
      console.error("Pet ID is undefined");
    }
  };

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return "/path/to/default/image.jpg";
    if (imgUrl.startsWith("images\\"))
      return `${BASE_URL}${imgUrl.replace("\\", "/")}`;
    return imgUrl;
  };

  if (!pet) {
    return <div>Pet not found</div>; // Xử lý trường hợp không có pet
  }

  return (
    <div className="petdetail-container">
      <div className="row">
        <div className="pet-img">
          <div class="col-sm-5 col-md-5 col-lg-5 float-left avatar-animal">
            <img src={getImageUrl(pet.img_url)} alt={pet.name} />
          </div>
        </div>
        <div class="col-sm-6 col-md-6 col-lg-6 caption-adoption float-right">
          <div className="pet-info">
            <h1>{pet.name}</h1> {/* Hiển thị tên thú cưng */}
            <p>
              <strong>Breed:</strong> {pet.breed}
            </p>
            <p>
              <strong>Age:</strong> {pet.age}
            </p>
            <p>
              <strong>Sex:</strong> {pet.sex}
            </p>
            <p>
              <strong>Size:</strong> {pet.size}
            </p>
            <p>
              <strong>Weight:</strong> {pet.weight}kg
            </p>
            {/*Thông tin*/}
            {!isLoggedIn && (
              <div className="adopt-button">
                <NavLink to="/login">
                  <Button>Adopt</Button>
                </NavLink>
              </div>
            )}
            {roleID === "3" && (
              <div className="adopt-button">
                <Button onClick={() => handleAdopt(pet)}>Adopt</Button>
              </div>
            )}
            {roleID === "3" &&
              pet.status.toLowerCase() === "unavailable" &&
              pet.accountID && (
                <div>
                  <div className="adopt-button">
                    <Button onClick={() => handleReport(pet)}>Report</Button>
                  </div>
                </div>
              )}
          </div>
          {roleID === "2" && (
            <div class="edit-button">
              <Button onClick={handleUpdatePet}>Edit Pet</Button>
            </div>
          )}
          {roleID === "2" && pet.status === "Unavailable" && pet.accountID && (
            <div class="edit-button">
              <Button onClick={handleRemind}>Remind</Button>
              <Button onClick={handleBanRequest}>Request Ban</Button>
            </div>
          )}
        </div>

        <div className="pet-status">
          <div className="column">
            <h2 className="infor-title">Informations</h2>
            <hr class="small-divider left mb-2"></hr>
            <div className="row">
              <div className="col">
                <p>
                  <strong>Vaccinated: </strong>{" "}
                  {pet.vaccinated ? (
                    <i
                      className="fa-solid fa-circle-check"
                      style={{ color: "#2fe44d" }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-circle-xmark"
                      style={{ color: "#d94545" }}
                    ></i>
                  )}
                </p>
                <p>
                  <strong>Spayed: </strong>
                  {pet.spayed ? (
                    <i
                      className="fa-solid fa-circle-check"
                      style={{ color: "#2fe44d" }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-circle-xmark"
                      style={{ color: "#d94545" }}
                    ></i>
                  )}
                </p>
                <p>
                  <strong>Socialized: </strong>
                  {pet.socialized ? (
                    <i
                      className="fa-solid fa-circle-check"
                      style={{ color: "#2fe44d" }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-circle-xmark"
                      style={{ color: "#d94545" }}
                    ></i>
                  )}
                </p>
              </div>
              <div className="col">
                <p>
                  <strong>Potty Trained: </strong>
                  {pet.potty_trained ? (
                    <i
                      className="fa-solid fa-circle-check"
                      style={{ color: "#2fe44d" }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-circle-xmark"
                      style={{ color: "#d94545" }}
                    ></i>
                  )}
                </p>
                <p>
                  <strong>Rabies Vaccinated: </strong>
                  {pet.rabies_vaccinated ? (
                    <i
                      className="fa-solid fa-circle-check"
                      style={{ color: "#2fe44d" }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-circle-xmark"
                      style={{ color: "#d94545" }}
                    ></i>
                  )}
                </p>
                <p>
                  <strong>Dietary Requirements: </strong>
                  {pet.dietary_requirements ? (
                    <i
                      className="fa-solid fa-circle-check"
                      style={{ color: "#2fe44d" }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-circle-xmark"
                      style={{ color: "#d94545" }}
                    ></i>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        {pet.status.toLowerCase() === "unavailable" && pet.accountID && (
          <div className="pet-video">
            {pet.video_report ? (
              <div>
                <h2>
                  Video report of {pet.name} at {pet.date_time_report}
                </h2>
                <video
                  src={videoSrc}
                  controls
                  style={{ width: "600px", height: "400px" }}
                />
              </div>
            ) : (
              <p>No video report available for this pet.</p>
            )}
          </div>
        )}
      </div>
      {roleID === "3" && (
        <section class="container-fluid support-banner-bg bg-fixed overlay">
          <div className="support-banner">
            <div className="container">
              <div className="row align-items-center">
                <div className="col">
                  <h2 className="support-text">
                    Have you already supported us?
                  </h2>
                </div>
                <div className="col-auto">
                  <NavLink to="/donate" className="nav-link">
                    <button className="support-button">DONATE NOW</button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="pets">
        <h2>Other Pets</h2> {/* Tiêu đề cho danh sách thú cưng khác */}
        <Carousel
          responsive={responsive}
          infinite={true}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {otherPets.map((otherPet, index) => (
            <div key={index} className="pet-card">
              <NavLink to={`/petdetail/${otherPet.petID}`} className="nav-link">
                <img src={otherPet.img_url} alt={otherPet.name} />
                <h3>{otherPet.name}</h3>
                <p>Sex: {otherPet.sex}</p>
                <p>Age: {otherPet.age}</p>
                <p>Vaccinated: {otherPet.vaccinated ? "Yes" : "No"}</p>
              </NavLink>
            </div>
          ))}
        </Carousel>
        <NavLink to="/petlist" className="nav-link">
          <button className="adopt-button">ADOPT</button>
        </NavLink>
      </section>

      <section class="container-fluid contact-bg overlay">
        <div className="support-banner">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="support-text">
                  You can contact us for more details!
                </h2>
              </div>
              <div className="col-auto">
                <NavLink to="/contact" className="nav-link">
                  <button className="support-button">CONTACT</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetDetail;
