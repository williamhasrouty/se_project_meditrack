import "./Header.css";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";

function Header({
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  onLogout,
  currentUser,
}) {
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
        currentUser={currentUser}
      />
    </header>
  );
}

export default Header;
