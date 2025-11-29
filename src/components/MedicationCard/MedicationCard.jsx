import "./MedicationCard.css";

function MedicationCard({ medication }) {
  return (
    <div className="medication-card">
      <h3 className="medication-card__name">{medication.name}</h3>
      <p className="medication-card__dosage">{medication.dosage}</p>
      <p className="medication-card__frequency">{medication.frequency}</p>
    </div>
  );
}

export default MedicationCard;
