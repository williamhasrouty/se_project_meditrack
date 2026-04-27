import "./StaffList.css";
import { useState, useEffect } from "react";
import Preloader from "../Preloader/Preloader";

function StaffList({ onGetStaffUsers, currentUser }) {
  const [staffUsers, setStaffUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = currentUser?.role === "admin";

  // Fetch staff users
  useEffect(() => {
    if (isAdmin && onGetStaffUsers) {
      setIsLoading(true);
      setError("");
      onGetStaffUsers()
        .then((users) => {
          setStaffUsers(users);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load staff users:", err);
          setError("Failed to load staff members. Please try again.");
          setIsLoading(false);
        });
    }
  }, [isAdmin, onGetStaffUsers]);

  // Filter staff based on search term
  const filteredStaff = searchTerm.trim()
    ? staffUsers.filter((staff) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          staff.name.toLowerCase().includes(searchLower) ||
          staff.email.toLowerCase().includes(searchLower) ||
          (staff.initials && staff.initials.toLowerCase().includes(searchLower))
        );
      })
    : staffUsers;

  const getInitials = (name) => {
    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      return (
        firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
      );
    }
    return name.charAt(0).toUpperCase();
  };

  if (!isAdmin) {
    return (
      <section className="staff-list">
        <p className="staff-list__error">
          Access denied. Admin privileges required.
        </p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="staff-list">
        <Preloader />
      </section>
    );
  }

  if (error) {
    return (
      <section className="staff-list">
        <p className="staff-list__error">{error}</p>
      </section>
    );
  }

  return (
    <section className="staff-list">
      <div className="staff-list__search-container">
        <input
          type="text"
          className="staff-list__search-input"
          placeholder="Search by name, email, or initials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStaff.length === 0 ? (
        <p className="staff-list__empty">
          {searchTerm
            ? "No staff members match your search"
            : "No staff members found"}
        </p>
      ) : (
        <div className="staff-list__grid">
          {filteredStaff.map((staff) => (
            <div key={staff._id} className="staff-list__card">
              <div className="staff-list__avatar">
                {staff.initials || getInitials(staff.name)}
              </div>
              <div className="staff-list__info">
                <h3 className="staff-list__name">{staff.name}</h3>
                <p className="staff-list__email">{staff.email}</p>
                {staff.initials && (
                  <p className="staff-list__initials">
                    Initials: {staff.initials}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default StaffList;
