import "./SideBar.css";

function SideBar({ onEditProfile, onLogout, currentUser }) {
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
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
      );
    } else {
      return (
        <div className="sidebar__avatar sidebar__avatar_placeholder">S</div>
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
