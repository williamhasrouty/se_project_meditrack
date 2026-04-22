// Client and Medication API functions (simulating backend)
// TODO: Replace with actual API calls when backend is ready

import { defaultClients, BASE_URL } from "./constants";

// Simulate API delay
function simulateDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get all clients for the logged-in user
function getClients(token) {
  return fetch(`${BASE_URL}/clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

// Get a single client by ID
function getClientById(clientId, token) {
  return fetch(`${BASE_URL}/clients/${clientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

// Add a new client
function addClient(clientData, token) {
  return fetch(`${BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clientData),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

// Update a client
function updateClient(clientId, clientData, token) {
  return fetch(`${BASE_URL}/clients/${clientId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clientData),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

// Delete a client
function deleteClient(clientId, token) {
  return fetch(`${BASE_URL}/clients/${clientId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

// Add a medication to a client
function addMedication(clientId, medicationData, token) {
  return fetch(`${BASE_URL}/clients/${clientId}/medications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(medicationData),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

// Update a medication
function updateMedication(clientId, medicationId, medicationData, token) {
  return fetch(`${BASE_URL}/clients/${clientId}/medications/${medicationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(medicationData),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

// Delete a medication
function deleteMedication(clientId, medicationId, token) {
  return fetch(`${BASE_URL}/clients/${clientId}/medications/${medicationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

// Save medication administration record
function saveMedicationAdministration(administrationData, token) {
  const { clientId, month, year, medicationId, records } = administrationData;
  return fetch(`${BASE_URL}/administrations/${clientId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ month, year, medicationId, records }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

// Get medication administration records
function getMedicationAdministrations(clientId, month, year, token) {
  return fetch(
    `${BASE_URL}/administrations/${clientId}?month=${month}&year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  });
}

export {
  getClients,
  getClientById,
  addClient,
  updateClient,
  deleteClient,
  addMedication,
  updateMedication,
  deleteMedication,
  saveMedicationAdministration,
  getMedicationAdministrations,
};
