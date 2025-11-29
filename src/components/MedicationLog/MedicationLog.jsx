import "./MedicationLog.css";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";

function MedicationLog({ clients, currentUser }) {
  const { clientId } = useParams();
  const client = clients?.find((c) => c._id === Number(clientId));
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const [administrations, setAdministrations] = useState({});

  if (!client) {
    return (
      <section className="medication-log">
        <h2 className="medication-log__error">Client not found</h2>
      </section>
    );
  }

  const times = ["AM", "Noon", "PM", "Bedtime"];

  const handleCellClick = (medicationId, day, time) => {
    const key = `${medicationId}-${day}-${time}`;
    const userInitials =
      currentUser?.initials ||
      currentUser?.name?.substring(0, 2).toUpperCase() ||
      "ST";
    setAdministrations((prev) => ({
      ...prev,
      [key]: prev[key] ? "" : userInitials,
    }));
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    {
      month: "long",
    }
  );

  return (
    <section className="medication-log">
      <div className="medication-log__header">
        <Link to="/" className="medication-log__back-btn">
          ← Back to Client List
        </Link>
        <h1 className="medication-log__title">{client.name}</h1>
        <h2 className="medication-log__subtitle">
          Medication Administration Record - {monthName} {currentYear}
        </h2>
      </div>

      <div className="medication-log__table-container">
        <table className="medication-log__table">
          <thead>
            <tr>
              <th className="medication-log__th medication-log__th_medication">
                Medication
              </th>
              <th className="medication-log__th medication-log__th_time">
                Time
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th
                  key={i + 1}
                  className="medication-log__th medication-log__th_day"
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {client.medications.map((medication) =>
              medication.times.map((time, timeIndex) => (
                <tr
                  key={`${medication.id}-${time}`}
                  className="medication-log__row"
                >
                  {timeIndex === 0 && (
                    <td
                      className="medication-log__td medication-log__td_medication"
                      rowSpan={medication.times.length}
                    >
                      {medication.name}
                    </td>
                  )}
                  <td className="medication-log__td medication-log__td_time">
                    {time}
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const key = `${medication.id}-${day}-${time}`;
                    return (
                      <td
                        key={day}
                        className="medication-log__td medication-log__td_cell"
                        onClick={() =>
                          handleCellClick(medication.id, day, time)
                        }
                      >
                        {administrations[key] || ""}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="medication-log__footer">
        <p className="medication-log__instructions">
          Click on any cell to add your initials for medication administration.
          Click again to remove.
        </p>
      </div>
    </section>
  );
}

export default MedicationLog;
