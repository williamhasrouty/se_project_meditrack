import "./SideBar.css";

function SideBar({ onEditProfile, onLogout, currentUser }) {
  const getInitials = (name) => {
    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      return (
        firstName.charAt(0).toUpperCase() +
        firstName.charAt(1).toLowerCase() +
        lastName.charAt(0).toUpperCase() +
        lastName.charAt(1).toLowerCase()
      );
    }
    return name.charAt(0).toUpperCase() + name.charAt(1).toLowerCase();
  };

  const renderAvatar = () => {
    if (currentUser && currentUser.avatar) {
      return (
        <img
          className="sidebar__avatar"
          src={currentUser.avatar}
          alt={currentUser.name}
        />
      );
    } else if (currentUser && currentUser.name) {
      return (
        <div className="sidebar__avatar sidebar__avatar_placeholder">
          {getInitials(currentUser.name)}
        </div>
      );
    } else {
      return (
        <div className="sidebar__avatar sidebar__avatar_placeholder">ST</div>
      );
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__top">
        {renderAvatar()}
        <p className="sidebar__username">
          {currentUser ? currentUser.name : "Staff Member"}
        </p>
      </div>

      <div className="sidebar__buttons">
        <button className="sidebar__edit-btn" onClick={onEditProfile}>
          Change profile data
        </button>
        <button className="sidebar__logout-btn" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default SideBar;
