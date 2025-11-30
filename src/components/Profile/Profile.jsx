import "./Profile.css";
import { useContext } from "react";
import SideBar from "./SideBar/SideBar";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Profile({ onEditProfile, onLogout }) {
  const currentUser = useContext(CurrentUserContext);
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
