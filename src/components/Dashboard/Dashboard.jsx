import { useState } from "react";
import "./Dashboard.css";
import ClientList from "../ClientList/ClientList";
import StaffList from "../StaffList/StaffList";

function Dashboard({
  clients,
  isLoading,
  error,
  onEditClient,
  onDeleteClient,
  currentUser,
  onAssignClient,
  onGetStaffUsers,
  onAddClient,
}) {
  const [activeTab, setActiveTab] = useState("clients");
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="dashboard">
      <div className="dashboard__tabs">
        <button
          className={`dashboard__tab ${activeTab === "clients" ? "dashboard__tab_active" : ""}`}
          onClick={() => setActiveTab("clients")}
        >
          Clients
        </button>
        {isAdmin && (
          <button
            className={`dashboard__tab ${activeTab === "staff" ? "dashboard__tab_active" : ""}`}
            onClick={() => setActiveTab("staff")}
          >
            Staff Members
          </button>
        )}
      </div>

      <div className="dashboard__content">
        {activeTab === "clients" ? (
          <ClientList
            clients={clients}
            isLoading={isLoading}
            error={error}
            onEditClient={onEditClient}
            onDeleteClient={onDeleteClient}
            currentUser={currentUser}
            onAssignClient={onAssignClient}
            onGetStaffUsers={onGetStaffUsers}
            onAddClient={onAddClient}
          />
        ) : (
          <StaffList
            onGetStaffUsers={onGetStaffUsers}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
