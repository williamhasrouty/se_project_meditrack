import "./ClientList.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Preloader from "../Preloader/Preloader";

function ClientList({
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
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name' or 'region'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [staffUsers, setStaffUsers] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  const isAdmin = currentUser?.role === "admin";

  // Reset visible count when clients change using useMemo
  const clientsLength = clients.length;
  const resetKey = useMemo(() => clientsLength, [clientsLength]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(10);
  }, [resetKey]);

  // Fetch staff users if admin
  useEffect(() => {
    if (
      isAdmin &&
      onGetStaffUsers &&
      !loadingStaff &&
      staffUsers.length === 0
    ) {
      setLoadingStaff(true);
      onGetStaffUsers()
        .then((users) => {
          setStaffUsers(users);
          setLoadingStaff(false);
        })
        .catch((err) => {
          console.error("Failed to load staff users:", err);
          setLoadingStaff(false);
        });
    }
  }, [isAdmin, onGetStaffUsers, loadingStaff, staffUsers.length]);

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;

    const searchLower = searchTerm.toLowerCase();
    return clients.filter((client) => {
      const nameParts = client.name.toLowerCase().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts[nameParts.length - 1] || "";
      const region = client.region.toLowerCase();

      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        region.includes(searchLower) ||
        client.name.toLowerCase().includes(searchLower)
      );
    });
  }, [clients, searchTerm]);

  // Sort filtered clients
  const sortedClients = useMemo(() => {
    const sorted = [...filteredClients];
    sorted.sort((a, b) => {
      let compareA, compareB;

      if (sortBy === "name") {
        compareA = a.name.toLowerCase();
        compareB = b.name.toLowerCase();
      } else if (sortBy === "region") {
        compareA = a.region.toLowerCase();
        compareB = b.region.toLowerCase();
      }

      if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredClients, sortBy, sortOrder]);

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
        firstName.charAt(0).toUpperCase() +
        firstName.charAt(1).toLowerCase() +
        lastName.charAt(0).toUpperCase() +
        lastName.charAt(1).toLowerCase()
      );
    }
    return name.charAt(0).toUpperCase();
  };

  const getRegionClass = (region) => {
    const regionClasses = {
      GGRC: "client-list__region--green",
      RCEB: "client-list__region--purple",
      ACRC: "client-list__region--yellow",
      RCOC: "client-list__region--orange",
      SDRC: "client-list__region--blue",
    };
    return regionClasses[region] || "client-list__region--default";
  };

  const handleAssignChange = (clientId, staffId) => {
    if (!onAssignClient) return;
    onAssignClient(clientId, staffId || null)
      .then(() => {
        // Success
      })
      .catch((err) => {
        console.error("Failed to assign client:", err);
        alert("Failed to assign client. Please try again.");
      });
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleClients = sortedClients.slice(0, visibleCount);
  const hasMore = visibleCount < sortedClients.length;

  if (isLoading) {
    return (
      <section className="client-list">
        <Preloader />
      </section>
    );
  }

  if (error) {
    return (
      <section className="client-list">
        <p className="client-list__error">{error}</p>
      </section>
    );
  }

  if (clients.length === 0) {
    return (
      <section className="client-list">
        <p className="client-list__empty">Nothing found</p>
      </section>
    );
  }

  return (
    <section className="client-list">
      <div className="client-list__search-container">
        <input
          type="text"
          className="client-list__search-input"
          placeholder="Search by name or region..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(10); // Reset visible count when searching
          }}
        />
        {isAdmin && onAddClient && (
          <button className="client-list__add-button" onClick={onAddClient}>
            + Add Client
          </button>
        )}
      </div>
      {filteredClients.length === 0 ? (
        <p className="client-list__empty">No clients match your search</p>
      ) : (
        <>
          <div className="client-list__table">
            <div className="client-list__header-row">
              <button
                className="client-list__header-cell client-list__header-cell--sortable"
                onClick={() => handleSort("name")}
                aria-label="Sort by client name"
              >
                Client
                {sortBy === "name" && (
                  <span className="client-list__sort-indicator">
                    {sortOrder === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </button>
              <button
                className="client-list__header-cell client-list__header-cell--sortable"
                onClick={() => handleSort("region")}
                aria-label="Sort by region"
              >
                Region
                {sortBy === "region" && (
                  <span className="client-list__sort-indicator">
                    {sortOrder === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </button>
              {isAdmin && (
                <div className="client-list__header-cell">Assigned To</div>
              )}
              {isAdmin && (
                <div className="client-list__header-cell">Actions</div>
              )}
            </div>
            <ul className="client-list__items">
              {visibleClients.map((client) => (
                <li key={client._id} className="client-list__row">
                  <Link
                    to={`/client/${client._id}`}
                    className="client-list__link"
                  >
                    <div className="client-list__cell client-list__cell--name">
                      <div className="client-list__avatar">
                        {client.imageUrl ? (
                          <img
                            src={client.imageUrl}
                            alt={client.name}
                            className="client-list__avatar-image"
                          />
                        ) : (
                          getInitials(client.name)
                        )}
                      </div>
                      <span className="client-list__name">{client.name}</span>
                    </div>
                    <div className="client-list__cell client-list__cell--region">
                      <span
                        className={`client-list__region ${getRegionClass(client.region)}`}
                      >
                        {client.region}
                      </span>
                    </div>
                  </Link>
                  {isAdmin && (
                    <div className="client-list__cell client-list__cell--assign">
                      <select
                        className="client-list__assign-select"
                        value={client.assignedTo?._id || ""}
                        onChange={(e) =>
                          handleAssignChange(client._id, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Unassigned</option>
                        {staffUsers.map((staff) => (
                          <option key={staff._id} value={staff._id}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {isAdmin && (
                    <div className="client-list__cell client-list__cell--actions">
                      <button
                        className="client-list__edit-button"
                        onClick={(e) => {
                          e.preventDefault();
                          onEditClient(client);
                        }}
                        aria-label="Edit client"
                      >
                        Edit
                      </button>
                      {/* <button
                        className="client-list__delete-button"
                        onClick={(e) => {
                          e.preventDefault();
                          onDeleteClient(client._id);
                        }}
                        aria-label="Delete client"
                      >
                        Delete
                      </button> */}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {hasMore && (
            <button className="client-list__show-more" onClick={handleShowMore}>
              Show more
            </button>
          )}
        </>
      )}
    </section>
  );
}

export default ClientList;
