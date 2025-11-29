import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import MedicationLog from "../MedicationLog/MedicationLog";
import ClientList from "../ClientList/ClientList";
import Profile from "../Profile/Profile";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

function App() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem("isLoggedIn");
    return saved === "true";
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : { name: "Staff Member" };
  });
  const [clients] = useState([
    {
      _id: 1,
      name: "John Smith",
      medications: [
        { id: 1, name: "Aspirin 81mg", times: ["AM"] },
        { id: 2, name: "Metformin 500mg", times: ["AM", "PM"] },
        { id: 3, name: "Lisinopril 10mg", times: ["AM"] },
      ],
    },
    {
      _id: 2,
      name: "Sarah Johnson",
      medications: [
        { id: 4, name: "Levothyroxine 50mcg", times: ["AM"] },
        { id: 5, name: "Atorvastatin 20mg", times: ["Bedtime"] },
      ],
    },
    {
      _id: 3,
      name: "Michael Davis",
      medications: [
        { id: 6, name: "Omeprazole 20mg", times: ["AM"] },
        { id: 7, name: "Amlodipine 5mg", times: ["AM"] },
        { id: 8, name: "Gabapentin 300mg", times: ["AM", "Noon", "PM"] },
      ],
    },
    {
      _id: 4,
      name: "Emily Wilson",
      medications: [
        { id: 9, name: "Sertraline 50mg", times: ["AM"] },
        { id: 10, name: "Vitamin D 1000IU", times: ["AM"] },
      ],
    },
  ]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  const handleLoginClick = () => setActiveModal("login");
  const handleRegisterClick = () => setActiveModal("register");
  const closeModal = () => setActiveModal("");
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser({ name: "Staff Member" });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleLogin = (credentials) => {
    // TODO: Implement actual login logic
    console.log("Login:", credentials);
    setCurrentUser({ name: credentials.email.split("@")[0] || "Staff Member" });
    setIsLoggedIn(true);
    closeModal();
  };

  const handleRegister = (userData) => {
    // TODO: Implement actual registration logic
    console.log("Register:", userData);
    setCurrentUser({ name: userData.name || "Staff Member" });
    setIsLoggedIn(true);
    closeModal();
  };

  const handleEditProfile = () => {
    setActiveModal("edit-profile");
  };

  const handleUpdateUser = (userData) => {
    // TODO: Implement actual API call to update user
    console.log("Update user:", userData);
    setCurrentUser((prev) => ({
      ...prev,
      name: userData.name,
      avatar: userData.avatar || prev.avatar,
      initials: userData.initials || prev.initials,
    }));
    closeModal();
  };

  return (
    <div className="app">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        onLogout={handleLogout}
      />
      <Main>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <ClientList clients={clients} />
              ) : (
                <div className="app__welcome">
                  <h1>Welcome to MediTrack</h1>
                  <p className="app__description">
                    A comprehensive medication tracking system for healthcare
                    professionals. Manage client medications, track
                    administration, and maintain accurate records.
                  </p>
                  <div className="app__cta">
                    <button
                      className="app__button app__button_primary"
                      onClick={handleLoginClick}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              )
            }
          />
          <Route path="/medications" element={<MedicationLog />} />
          <Route path="/clients" element={<ClientList clients={clients} />} />
          <Route
            path="/client/:clientId"
            element={
              <MedicationLog clients={clients} currentUser={currentUser} />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                onEditProfile={handleEditProfile}
                onLogout={handleLogout}
                currentUser={currentUser}
              />
            }
          />
        </Routes>
      </Main>
      <Footer />

      <LoginModal
        isOpen={activeModal === "login"}
        onClose={closeModal}
        onLogin={handleLogin}
        onRegisterClick={() => setActiveModal("register")}
      />
      <RegisterModal
        isOpen={activeModal === "register"}
        onClose={closeModal}
        onRegister={handleRegister}
        onLoginClick={() => setActiveModal("login")}
      />
      <EditProfileModal
        isOpen={activeModal === "edit-profile"}
        onClose={closeModal}
        onUpdateUser={handleUpdateUser}
        currentUser={currentUser}
      />
    </div>
  );
}

export default App;
