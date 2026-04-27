import "./Profile.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import SideBar from "./SideBar/SideBar";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Profile({ onEditProfile, onLogout, clients }) {
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
        <h2 className="profile__title">Profile Overview</h2>
        <p className="profile__description">
          Manage your account information and view your clients.
        </p>

        {clients.length > 0 && (
          <div className="profile__clients">
            <h3 className="profile__section-title">Your Clients</h3>
            <ul className="profile__client-list">
              {clients.map((client) => (
                <li key={client._id} className="profile__client-item">
                  <Link
                    to={`/client/${client._id}`}
                    className="profile__client-link"
                  >
                    <div className="profile__client-info">
                      <h4 className="profile__client-name">{client.name}</h4>
                      <p className="profile__client-meds">
                        {client.medications.length} medication
                        {client.medications.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="profile__client-arrow">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
