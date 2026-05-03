import "./Navigation.css";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import NotificationsContext from "../../contexts/NotificationsContext";
import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";
import notificationBell from "../../assets/blue-bell.png";

function Navigation({
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  onLogout,
  currentUser,
  onAddClient,
}) {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);
  const { unreadCount } = useContext(NotificationsContext);

  const isAdmin = currentUser?.role === "admin";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    onLogout();
  };

  const handleLoginClick = () => {
    closeMobileMenu();
    onLoginClick();
  };

  const handleRegisterClick = () => {
    closeMobileMenu();
    onRegisterClick();
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isNotificationsOpen]);

  return (
    <nav className="navigation">
      {/* Desktop Navigation */}
      <div className="navigation__desktop">
        {isLoggedIn && (
          <div className="navigation__links">
            {isAdmin && (
              <div className="navigation__notifications" ref={notificationsRef}>
                <button
                  className="navigation__notifications-btn"
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  
                  {unreadCount > 0 && (
                    <span className="navigation__notifications-badge">
                      {unreadCount}
                    </span>
                  )}
                 
                </button>

                <NotificationsDropdown
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                />
              </div>
            )}
            <NavLink
              to={isProfilePage ? "/" : "/profile"}
              className={({ isActive }) =>
                `navigation__link ${isActive ? "navigation__link_active" : ""}`
              }
            >
              {isProfilePage ? "Dashboard" : currentUser?.name || "My Profile"}
            </NavLink>
             <img
                    src={notificationBell}
                    alt="Notifications"
                    className="navigation__notifications-icon"
                  />
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
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className={`navigation__hamburger ${
          isMobileMenuOpen ? "navigation__hamburger_active" : ""
        }`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span className="navigation__hamburger-line"></span>
        <span className="navigation__hamburger-line"></span>
        <span className="navigation__hamburger-line"></span>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="navigation__mobile-menu">
          {isLoggedIn && (
            <>
              <NavLink
                to={isProfilePage ? "/" : "/profile"}
                className="navigation__mobile-link"
                onClick={closeMobileMenu}
              >
                {isProfilePage
                  ? "Dashboard"
                  : currentUser?.name || "My Profile"}
              </NavLink>
              <button
                className="navigation__mobile-button navigation__mobile-button_logout"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <button
                className="navigation__mobile-button"
                onClick={handleLoginClick}
              >
                Log In
              </button>
              <button
                className="navigation__mobile-button navigation__mobile-button_signup"
                onClick={handleRegisterClick}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navigation;
