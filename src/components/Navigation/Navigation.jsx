import "./Navigation.css";
import { NavLink, useLocation } from "react-router-dom";

function Navigation({
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  onLogout,
  currentUser,
}) {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  return (
    <nav className="navigation">
      {isLoggedIn && (
        <div className="navigation__links">
          <NavLink
            to={isProfilePage ? "/" : "/profile"}
            className={({ isActive }) =>
              `navigation__link ${isActive ? "navigation__link_active" : ""}`
            }
          >
            {isProfilePage ? "Clients" : currentUser?.name || "My Profile"}
          </NavLink>
          <button
            className="navigation__button navigation__button_logout"
            onClick={onLogout}
          >
            Log Out
          </button>
        </div>
      )}
      {!isLoggedIn && (
        <>
          <button className="navigation__button" onClick={onLoginClick}>
            Log In
          </button>
          <button
            className="navigation__button navigation__button_type_signup"
            onClick={onRegisterClick}
          >
            Sign Up
          </button>
        </>
      )}
    </nav>
  );
}

export default Navigation;
