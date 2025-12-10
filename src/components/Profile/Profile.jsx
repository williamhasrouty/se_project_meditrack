import "./Profile.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import SideBar from "./SideBar/SideBar";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Profile({ onEditProfile, onLogout, clients }) {
  const currentUser = useContext(CurrentUserContext);

  const totalClients = clients.length;
  const totalMedications = clients.reduce(
    (sum, client) => sum + client.medications.length,
    0
  );

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
          Manage your account information and view your client statistics.
        </p>

        <div className="profile__stats">
          <div className="profile__stat-card">
            <h3 className="profile__stat-number">{totalClients}</h3>
            <p className="profile__stat-label">Total Clients</p>
          </div>
          <div className="profile__stat-card">
            <h3 className="profile__stat-number">{totalMedications}</h3>
            <p className="profile__stat-label">Total Medications</p>
          </div>
        </div>

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
