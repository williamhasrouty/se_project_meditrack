import "./StaffList.css";
import { useState, useEffect, useMemo } from "react";
import Preloader from "../Preloader/Preloader";

function StaffList({ onGetStaffUsers, currentUser }) {
  const [staffUsers, setStaffUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name' or 'email'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

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
  const filteredStaff = useMemo(() => {
    if (!searchTerm.trim()) return staffUsers;

    const searchLower = searchTerm.toLowerCase();
    return staffUsers.filter((staff) => {
      return (
        staff.name.toLowerCase().includes(searchLower) ||
        staff.email.toLowerCase().includes(searchLower) ||
        (staff.initials && staff.initials.toLowerCase().includes(searchLower))
      );
    });
  }, [staffUsers, searchTerm]);

  // Sort filtered staff
  const sortedStaff = useMemo(() => {
    const sorted = [...filteredStaff];
    sorted.sort((a, b) => {
      let compareA, compareB;

      if (sortBy === "name") {
        compareA = a.name.toLowerCase();
        compareB = b.name.toLowerCase();
      } else if (sortBy === "email") {
        compareA = a.email.toLowerCase();
        compareB = b.email.toLowerCase();
      }

      if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredStaff, sortBy, sortOrder]);

  // Handle sort column click
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortOrder("asc");
    }
  };

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
        <div className="staff-list__table">
          <div className="staff-list__header-row">
            <button
              className="staff-list__header-cell staff-list__header-cell--sortable"
              onClick={() => handleSort("name")}
              aria-label="Sort by staff name"
            >
              Staff Member
              {sortBy === "name" && (
                <span className="staff-list__sort-indicator">
                  {sortOrder === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </button>
            <button
              className="staff-list__header-cell staff-list__header-cell--sortable"
              onClick={() => handleSort("email")}
              aria-label="Sort by email"
            >
              Email
              {sortBy === "email" && (
                <span className="staff-list__sort-indicator">
                  {sortOrder === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </button>
            <div className="staff-list__header-cell">Initials</div>
          </div>
          <ul className="staff-list__items">
            {sortedStaff.map((staff) => (
              <li key={staff._id} className="staff-list__row">
                <div className="staff-list__cell staff-list__cell--name">
                  <div className="staff-list__avatar">
                    {staff.initials || getInitials(staff.name)}
                  </div>
                  <span className="staff-list__name">{staff.name}</span>
                </div>
                <div className="staff-list__cell staff-list__cell--email">
                  <span className="staff-list__email">{staff.email}</span>
                </div>
                <div className="staff-list__cell staff-list__cell--initials">
                  <span className="staff-list__initials-badge">
                    {staff.initials || getInitials(staff.name)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default StaffList;
