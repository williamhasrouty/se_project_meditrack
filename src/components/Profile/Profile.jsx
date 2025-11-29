import "./Profile.css";
import SideBar from "./SideBar/SideBar";

function Profile({ onEditProfile, onLogout, currentUser }) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar
          onEditProfile={onEditProfile}
          onLogout={onLogout}
          currentUser={currentUser}
        />
      </section>
      <section className="profile__content">
        <h2 className="profile__title">Profile Settings</h2>
        <p className="profile__description">
          Manage your account information and preferences.
        </p>
      </section>
    </div>
  );
}

export default Profile;
