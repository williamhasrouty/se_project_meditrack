import "./ClientList.css";
import { Link } from "react-router-dom";

function ClientList({ clients }) {
  return (
    <section className="client-list">
      <h2 className="client-list__title">Your Clients</h2>
      <ul className="client-list__items">
        {clients.map((client) => (
          <li key={client._id} className="client-list__card">
            <Link to={`/client/${client._id}`} className="client-list__link">
              <div className="client-list__avatar">
                {client.name.charAt(0).toUpperCase()}
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
