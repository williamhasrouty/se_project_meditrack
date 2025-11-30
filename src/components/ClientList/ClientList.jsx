import "./ClientList.css";
import { Link } from "react-router-dom";

function ClientList({ clients }) {
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

  return (
    <section className="client-list">
      <h2 className="client-list__title">Your Clients</h2>
      <ul className="client-list__items">
        {clients.map((client) => (
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
    </section>
  );
}

export default ClientList;
