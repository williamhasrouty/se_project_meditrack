import "./Header.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "../Navigation/Navigation";

function Header({
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  onLogout,
  currentUser,
}) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = () => {
    return currentDateTime.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <header className="header">
      <div className="header__left">
        <Link to="/" className="header__logo">
          MediTrack
        </Link>
        <span className="header__datetime">{formatDateTime()}</span>
      </div>
      <Navigation
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
        onLogout={onLogout}
        currentUser={currentUser}
      />
    </header>
  );
}

export default Header;
