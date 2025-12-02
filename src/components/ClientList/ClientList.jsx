import "./ClientList.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Preloader from "../Preloader/Preloader";

function ClientList({ clients, isLoading, error }) {
  const [visibleCount, setVisibleCount] = useState(3);

  // Reset visible count when clients change using useMemo
  const clientsLength = clients.length;
  const resetKey = useMemo(() => clientsLength, [clientsLength]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(3);
  }, [resetKey]);

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

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleClients = clients.slice(0, visibleCount);
  const hasMore = visibleCount < clients.length;

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
      <h2 className="client-list__title">Your Clients</h2>
      <ul className="client-list__items">
        {visibleClients.map((client) => (
          <li key={client._id} className="client-list__card">
            <Link to={`/client/${client._id}`} className="client-list__link">
              <div className="client-list__avatar">
                {getInitials(client.name)}
              </div>
              <h3 className="client-list__name">{client.name}</h3>
            </Link>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button className="client-list__show-more" onClick={handleShowMore}>
          Show more
        </button>
      )}
    </section>
  );
}

export default ClientList;
