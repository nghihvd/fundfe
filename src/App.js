import "./App.scss";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Account/Login";
import Register from "./Account/Register";
import Footer from "./components/Footer";
import Events from "./Event/Events";
import PetUpdate from "./Pet_Page/UpdatePet";
import HomePage from "./components/HomePage";
import Contact from "./Contact/Contact";
import Donate from "./Donation/Donate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Routes/ProtectRoute";
import Admin from "./Account/Admin";
import Staff from "./Account/Staff";
import AppoimentTable from "./Appointment/AppoimentTable";
import PetDetail from "./Pet_Page/PetDetail";
import AdoptProcess from "./Adoption/AdoptProcess";
import PetsList from "./Pet_Page/PetList";
import PetListAdmin from "./Pet_Page/PetListAdmin";
import AddPet from "./Pet_Page/AddPet";
import AddPetNotifications from "./Notifications/AddPetNotifications";
import RequestRegisterNotifications from "./Notifications/RequestRegisterNotifications";
import Report from "./Report/Report";
import BanRequestNotifications from "./Notifications/BanRequestNotifications";

function App() {
  const roleID = localStorage.getItem("roleID")
    ? Number(localStorage.getItem("roleID"))
    : null;
  return (
    <>
      <div className="app-container">
        <Header roleID={roleID} />
        <div>
          <Container>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/PetUpdate/:petID" element={<PetUpdate />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/petlist" element={<PetsList />} />

              <Route path="/petdetail/:petID" element={<PetDetail />} />
              <Route path="/adoptprocess/:petID" element={<AdoptProcess />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute roleID={1}>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/adoptprocess/:petID"
                element={
                  <ProtectedRoute roleID={3}>
                    <AdoptProcess />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/staff"
                element={
                  <ProtectedRoute roleID={2}>
                    <Staff />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/appoinment"
                element={
                  <ProtectedRoute roleID={2}>
                    <AppoimentTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addpet"
                element={
                  <ProtectedRoute roleID={2}>
                    <AddPet />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/petlistadmin"
                element={
                  <ProtectedRoute roleID={[1, 2]}>
                    <PetListAdmin />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin-notifications/add-pet"
                element={
                  <ProtectedRoute roleID={1}>
                    <AddPetNotifications />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin-notifications/request-register"
                element={
                  <ProtectedRoute roleID={1}>
                    <RequestRegisterNotifications />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/admin-notifications/ban-request"
                element={
                  <ProtectedRoute roleID={1}>
                    <BanRequestNotifications />
                  </ProtectedRoute>
                }
              />


            </Routes>
          </Container>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
