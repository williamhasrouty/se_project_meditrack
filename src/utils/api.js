// Client and Medication API functions (simulating backend)
// TODO: Replace with actual API calls when backend is ready

import { defaultClients, BASE_URL } from "./constants";

// Helper function to handle API responses with proper error handling
function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  // Try to parse error as JSON, fallback to statusText for non-JSON errors (like rate limits)
  return res
    .json()
    .catch(() => {
      throw new Error(res.statusText || `Error: ${res.status}`);
    })
    .then((err) => Promise.reject(err));
}

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
  }).then(handleResponse);
}

// Get a single client by ID
function getClientById(clientId, token) {
  return fetch(`${BASE_URL}/clients/${clientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
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
  }).then(handleResponse);
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
  }).then(handleResponse);
}

// Delete a client
function deleteClient(clientId, token) {
  return fetch(`${BASE_URL}/clients/${clientId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
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
  }).then(handleResponse);
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
  }).then(handleResponse);
}

// Delete a medication
function deleteMedication(clientId, medicationId, token) {
  return fetch(`${BASE_URL}/clients/${clientId}/medications/${medicationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
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
  }).then(handleResponse);
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
    },
  ).then(handleResponse);
}

// Assign client to staff (admin only)
function assignClient(clientId, staffIds, token) {
  // Support both single ID (string) and multiple IDs (array)
  const body = Array.isArray(staffIds)
    ? { staffIds: staffIds }
    : { staffId: staffIds || null };

  return fetch(`${BASE_URL}/clients/${clientId}/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }).then(handleResponse);
}

// Get all staff users (admin only)
function getStaffUsers(token) {
  return fetch(`${BASE_URL}/users/staff`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
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
  assignClient,
  getStaffUsers,
};
