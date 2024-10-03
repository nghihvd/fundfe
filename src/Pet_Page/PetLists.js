import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { BASE_URL } from "../services/axios";
import { useEffect } from "react";
import "../styles/petslist.scss";
import { useCallback } from "react";
import { FaFilter } from "react-icons/fa";
const PetsList = () => {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [petsPerPage] = useState(8);
  const [searchParams, setSearchParams] = useState({
    name: "",
    age: "",
    categoryID: 0,
    sex: "",
  });
  const navigate = useNavigate();
  const [ageError, setAgeError] = useState("");
  const [noResults, setNoResults] = useState(false);
  useEffect(() => {
    const checkRole = async () => {
      const roleID = localStorage.getItem("roleID");
      try {
        if (roleID === "3") {
          await apiListPets();
        }
      } catch (error) {
        console.error("Error pets:", error);
      }
    };
    checkRole();
  }, [navigate]);

  // Gọi API lấy danh sách các pet cho người dùng
  const apiListPets = async () => {
    try {
      const response = await axios.get("/pets/showListOfPets");
      setPets(response.data);
    } catch (error) {
      console.error("Error Api pets:", error);
      if (error.code === "ERR_NETWORK") {
        console.error("Network error!");
      }
    }
  };
  // Hàm xử lý khi người dùng nhập thông tin tìm kiếm
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const searchData = {
        name: searchParams.name || "",
        age: searchParams.age ? parseFloat(searchParams.age) : 0,
        categoryID: searchParams.categoryID || 0,
        sex: searchParams.sex || "",
      };

      const response = await axios.get("/pets/searchByNameAndBreed", {
        params: searchData,
      });
      if (response.data.length === 0) {
        setNoResults(true);
        setPets([]);
      } else {
        setNoResults(false);
        setPets(response.data);
      }
    } catch (error) {
      console.error("Error searching pets:", error);
      setNoResults(true);
      setPets([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      const floatValue = parseFloat(value);
      if (value === "" || (floatValue >= 1 && !isNaN(floatValue))) {
        setSearchParams((prevParams) => ({
          ...prevParams,
          [name]: value,
        }));
        setAgeError("");
      } else {
        setAgeError("Age must be 1 or greater");
      }
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        [name]:
          name === "categoryID" ? (value === "" ? 0 : parseInt(value)) : value,
      }));
    }
  };
  // Hàm xử lý khi người dùng click vào một pet
  const handlePetClick = (pet) => {
    if (pet.petID) {
      console.log("Navigating to pet detail with ID:", pet.petID);
      navigate(`/petdetail/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefined");
    }
  };
  // Hàm lấy đường dẫn ảnh từ API
  const getImageUrl = useCallback((imgUrl) => {
    if (!imgUrl) return "/path/to/default/image.jpg";
    if (imgUrl.startsWith("images\\"))
      return `${BASE_URL}${imgUrl.replace("\\", "/")}`;
    return imgUrl;
  }, []);

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pets-list-container">
      <div className="filter-and-search">
        <div className="search-section">
          <div className="search-inputs">
            <input
              type="text"
              name="name"
              value={searchParams.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </div>

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={ageError !== ""}
          >
            Search
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="other-filters">
            <div className="filter-section">
              <h3>
                <FaFilter /> filter
              </h3>
            </div>
            <input
              type="number"
              name="age"
              value={searchParams.age}
              onChange={handleInputChange}
              placeholder="Select Age"
              step="0.5"
              min="1"
            />
            {ageError && <span className="error">{ageError}</span>}
            <select
              name="categoryID"
              value={searchParams.categoryID}
              onChange={handleInputChange}
            >
              <option value={0}>Select Category</option>
              <option value={1}>Dog</option>
              <option value={2}>Cat</option>
            </select>
            <select
              name="sex"
              value={searchParams.sex}
              onChange={handleInputChange}
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </form>
      </div>

      <div className="pets-grid">
        {currentPets.length > 0 ? (
          currentPets.map((pet) => (
            <div
              key={pet.petID}
              className="pet-item"
              onClick={() => handlePetClick(pet)}
            >
              <img src={getImageUrl(pet.img_url)} alt={pet.name} />
              <h3>{pet.name}</h3>
              <div className="pet-info-divider"></div>
              <p>Age: {pet.age} month</p>
              <p>Sex: {pet.sex}</p>
              <button onClick={() => handlePetClick(pet)}>View Details</button>
            </div>
          ))
        ) : (
          <p>No pets found</p>
        )}
      </div>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(pets.length / petsPerPage) },
          (_, i) => (
            <button key={i} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default PetsList;