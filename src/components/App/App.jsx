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
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { signup, signin, getUser } from "../../utils/auth";
import updateUser from "../../utils/updateUser";
import { defaultClients } from "../../utils/constants";

function App() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [clients] = useState(defaultClients);

  // Set isLoggedIn based on currentUser (like se_project_react)
  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  // Check token on app mount (like se_project_react)
  useEffect(() => {
    const stored = localStorage.getItem("jwt");
    if (stored) {
      getUser(stored)
        .then((user) => {
          setCurrentUser(user);
          setToken(stored);
        })
        .catch((err) => {
          console.error("Token verification failed:", err);
          localStorage.removeItem("jwt");
          setCurrentUser(null);
          setToken(null);
        });
    } else {
      setCurrentUser(null);
      setToken(null);
    }
  }, []);

  const handleLoginClick = () => {
    setLoginError("");
    setActiveModal("login");
  };
  const handleRegisterClick = () => {
    setRegisterError("");
    setActiveModal("register");
  };
  const closeModal = () => {
    setActiveModal("");
    setLoginError("");
    setRegisterError("");
  };

  // Sign out logic (like se_project_react)
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setToken(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleLogin = (credentials) => {
    setLoginError("");
    signin(credentials)
      .then((res) => {
        if (res && res.token) {
          localStorage.setItem("jwt", res.token);
          setToken(res.token);
          return getUser(res.token);
        }
        return Promise.reject("No token in signin response");
      })
      .then((user) => {
        setCurrentUser(user);
        closeModal();
        navigate("/");
      })
      .catch((err) => {
        console.error("Login failed:", err);
        setLoginError(err.message);
      });
  };

  const handleRegister = (userData) => {
    setRegisterError("");
    signup(userData)
      .then(() =>
        signin({ email: userData.email, password: userData.password })
      )
      .then((res) => {
        if (res && res.token) {
          localStorage.setItem("jwt", res.token);
          setToken(res.token);
          return getUser(res.token);
        }
        return Promise.reject("No token in signin response");
      })
      .then((user) => {
        setCurrentUser(user);
        closeModal();
        navigate("/");
      })
      .catch((err) => {
        console.error("Registration failed:", err);
        setRegisterError(err.message);
      });
  };

  const handleEditProfile = () => {
    setActiveModal("edit-profile");
  };

  const handleUpdateUser = (userData) => {
    if (!token) return;
    updateUser(userData, token)
      .then((user) => {
        setCurrentUser(user);
        closeModal();
      })
      .catch((err) => console.error("Update user failed:", err));
  };

  // ESC key handler to close modals
  useEffect(() => {
    if (!activeModal) return;
    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
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
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <MedicationLog clients={clients} currentUser={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Profile
                    onEditProfile={handleEditProfile}
                    onLogout={handleLogout}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Main>
        <Footer />

        <LoginModal
          isOpen={activeModal === "login"}
          onClose={closeModal}
          onLogin={handleLogin}
          onRegisterClick={() => {
            setLoginError("");
            setActiveModal("register");
          }}
          errorMessage={loginError}
        />
        <RegisterModal
          isOpen={activeModal === "register"}
          onClose={closeModal}
          onRegister={handleRegister}
          onLoginClick={() => {
            setRegisterError("");
            setActiveModal("login");
          }}
          errorMessage={registerError}
        />
        <EditProfileModal
          isOpen={activeModal === "edit-profile"}
          onClose={closeModal}
          onUpdateUser={handleUpdateUser}
          currentUser={currentUser}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
