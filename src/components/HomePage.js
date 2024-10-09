import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../styles/homepage.scss";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import dog1 from "../assets/images/dog-1.jpg";
import dog2 from "../assets/images/dog-2.jpg";
import dog3 from "../assets/images/dog-3.jpg";
import dog4 from "../assets/images/dog-4.jpg";
import aboutUsImage from "../assets/images/logo.png"; // Đảm bảo bạn có hình ảnh này

const HomePage = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const newsItems = [
    {
      id: 1,
      image: dog2,
      title: "The Famous Shiba Inu Dog Around the World...",
      description:
        "In every group of friends, there's always someone who is an expert",
    },
    {
      id: 2,
      image: dog1,
      title: '"The Saddest Dog in the World" Back Then...',
      description: "A happy ending for the cat after just one year",
    },
    {
      id: 3,
      image: dog3,
      title: "Meet the Dog Taking the Internet by Storm...",
      description:
        "Meet the Dog Taking the Internet by Storm with Its Mischievous Paw",
    },
    {
      id: 4,
      image: dog4,
      title: "Meet the Dog Taking the Internet by Storm...",
      description:
        "Meet the Dog Taking the Internet by Storm with Its Mischievous Paw",
    },
  ];

  const nextNews = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex(
      (prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length
    );
  };
  const pets = [
    {
      name: "Win",
      image: dog1,
      gender: "Male",
      age: "Adult",
      vaccinated: "Yes",
    },
    {
      name: "Elvis",
      image: dog2,
      gender: "Male",
      age: "Adult",
      vaccinated: "Unknown",
    },
    {
      name: "Nicky",
      image: dog3,
      gender: "Male",
      age: "Adult",
      vaccinated: "Yes",
    },
    {
      name: "Orion",
      image: dog4,
      gender: "Female",
      age: "Adult",
      vaccinated: "Yes",
    },
  ];

  return (
    /**Banner */
    <div className="homepage">
      <section className="hero-section">
        <h2>FurryFriendsFund</h2>
        <p>"Open your heart, adopt a furry friend in need!"</p>
      </section>

      <section className="about-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2>Adopt Pets - FurryFriendsFund</h2>
              <p>
                We are a group of passionate young students from FPT University,
                working together on a meaningful project focused on the adoption
                and fundraising support for stray dogs and cats. With the goal
                of giving these pets a new home, our group not only connects
                abandoned dogs and cats with loving owners but also organizes
                fundraising events to help cover the costs of their care and
                medical treatment. Through this project, we hope to spread the
                message of love and responsibility towards these less fortunate
                pets, while also fostering a connected community that stands
                together for animal welfare.
              </p>

              <NavLink to="/contact" className="nav-link">
                <button className="about-us-button">ABOUT US</button>
              </NavLink>
            </div>
            <div className="col-md-4">
              <img
                src={aboutUsImage}
                alt="About Us"
                className="about-us-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách các bé */}
      <section className="featured-pets">
        <h2>Lists of pets</h2>
        <Carousel
          responsive={responsive}
          infinite={true}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {pets.map((pet, index) => (
            <div key={index} className="pet-card">
              <NavLink to="/adopt" className="nav-link">
                <img src={pet.image} alt={pet.name} />
                <h3>{pet.name}</h3>
                <p>Sex: {pet.gender}</p>
                <p>Age: {pet.age}</p>
                <p>Vaccinated: {pet.vaccinated}</p>
              </NavLink>
            </div>
          ))}
        </Carousel>
        <NavLink to="/adopt" className="nav-link">
          <button className="adopt-button">ADOPT</button>
        </NavLink>
      </section>

      {/* Tin tức */}
      <section className="news">
        <h2>News</h2>
        <div className="news-slider">
          <button onClick={prevNews} className="slider-button left">
            <FaChevronLeft />
          </button>
          <div className="news-items">
            {newsItems.map((item, index) => (
              <div
                key={item.id}
                className={`news-item ${
                  index === currentNewsIndex ? "active" : ""
                }`}
              >
                <img src={item.image} alt={item.title} />
                <div className="news-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={nextNews} className="slider-button right">
            <FaChevronRight />
          </button>
        </div>
        <button className="read-more">READ MORE</button>
      </section>

      <section class="container-fluid support-banner-bg bg-fixed overlay">
        <div className="support-banner">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="support-text">Have you already supported us?</h2>
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
    </div>
  );
};

export default HomePage;
