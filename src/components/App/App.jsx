import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import MedicationLog from "../MedicationLog/MedicationLog";
import Dashboard from "../Dashboard/Dashboard";
import Profile from "../Profile/Profile";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import AddClientModal from "../AddClientModal/AddClientModal";
import EditClientModal from "../EditClientModal/EditClientModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { signup, signin, getUser } from "../../utils/auth";
import updateUser from "../../utils/updateUser";
import {
  getClients,
  addClient,
  updateClient,
  deleteClient,
  assignClient,
  getStaffUsers,
} from "../../utils/api";

function App() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Derive isLoggedIn from currentUser instead of using useEffect
  const isLoggedInDerived = !!currentUser;

  // Load clients when user logs in
  useEffect(() => {
    if (isLoggedInDerived && token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      setDataError("");
      getClients(token)
        .then((data) => {
          setClients(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load clients:", err);
          setDataError(
            "Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later.",
          );
          setIsLoading(false);
        });
    } else if (!isLoggedInDerived) {
      setClients([]);
      setIsLoading(false);
      setDataError("");
    }
  }, [isLoggedInDerived, token]);

  // Check token on app mount
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

  // Sign out logic
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setToken(null);
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
        signin({ email: userData.email, password: userData.password }),
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

  const handleAddClientClick = () => {
    setActiveModal("add-client");
  };

  const handleAddClient = (clientData) => {
    if (!token) return Promise.reject(new Error("No token"));
    return addClient(clientData, token).then((newClient) => {
      setClients([...clients, newClient]);
      return newClient;
    });
  };

  const handleEditClientClick = (client) => {
    setSelectedClient(client);
    setActiveModal("edit-client");
  };

  const handleUpdateClient = (clientData) => {
    if (!token || !selectedClient)
      return Promise.reject(new Error("No token or client"));
    return updateClient(selectedClient._id, clientData, token).then(
      (updatedClient) => {
        setClients(
          clients.map((client) =>
            client._id === updatedClient._id ? updatedClient : client,
          ),
        );
        return updatedClient;
      },
    );
  };

  const handleDeleteClient = (clientId) => {
    if (!token) return Promise.reject(new Error("No token"));
    if (
      window.confirm(
        "Are you sure you want to delete this client? This will also delete all their medications.",
      )
    ) {
      return deleteClient(clientId, token).then(() => {
        setClients(clients.filter((client) => client._id !== clientId));
      });
    }
    return Promise.resolve();
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

  const refreshClients = () => {
    if (!token) return Promise.reject(new Error("No token"));
    return getClients(token)
      .then((data) => {
        setClients(data);
        return data;
      })
      .catch((err) => {
        console.error("Failed to refresh clients:", err);
        throw err;
      });
  };

  const handleAssignClient = (clientId, staffId) => {
    if (!token) return Promise.reject(new Error("No token"));
    return assignClient(clientId, staffId, token)
      .then((updatedClient) => {
        setClients(
          clients.map((client) =>
            client._id === updatedClient._id ? updatedClient : client,
          ),
        );
        return updatedClient;
      })
      .catch((err) => {
        console.error("Failed to assign client:", err);
        throw err;
      });
  };

  const handleGetStaffUsers = () => {
    if (!token) return Promise.reject(new Error("No token"));
    return getStaffUsers(token).catch((err) => {
      console.error("Failed to fetch staff users:", err);
      throw err;
    });
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
          isLoggedIn={isLoggedInDerived}
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          onLogout={handleLogout}
          currentUser={currentUser}
          onAddClient={handleAddClientClick}
        />
        <Main>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedInDerived ? (
                  <Dashboard
                    clients={clients}
                    isLoading={isLoading}
                    error={dataError}
                    onEditClient={handleEditClientClick}
                    onDeleteClient={handleDeleteClient}
                    currentUser={currentUser}
                    onAssignClient={handleAssignClient}
                    onGetStaffUsers={handleGetStaffUsers}
                    onAddClient={handleAddClientClick}
                  />
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

            <Route
              path="/client/:clientId"
              element={
                <ProtectedRoute isLoggedIn={isLoggedInDerived}>
                  <MedicationLog
                    clients={clients}
                    currentUser={currentUser}
                    refreshClients={refreshClients}
                    onEditClient={handleEditClientClick}
                    onDeleteClient={handleDeleteClient}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedInDerived}>
                  <Profile
                    onEditProfile={handleEditProfile}
                    onLogout={handleLogout}
                    clients={clients}
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
        <AddClientModal
          isOpen={activeModal === "add-client"}
          onClose={closeModal}
          onAddClient={handleAddClient}
        />
        <EditClientModal
          isOpen={activeModal === "edit-client"}
          onClose={closeModal}
          onEditClient={handleUpdateClient}
          client={selectedClient}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
