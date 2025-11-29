import "./Header.css";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";

function Header({ isLoggedIn, onLoginClick, onRegisterClick, onLogout }) {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        MediTrack
      </Link>
      <Navigation
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
        onLogout={onLogout}
      />
    </header>
  );
}

export default Header;
