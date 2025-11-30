// Client and Medication API functions (simulating backend)
// TODO: Replace with actual API calls when backend is ready

import { defaultClients } from "./constants";

// Simulate API delay
function simulateDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get all clients for the logged-in user
function getClients(token) {
  return simulateDelay(300).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    // In a real app, this would fetch user-specific clients from backend
    return Promise.resolve(defaultClients);
  });
}

// Get a single client by ID
function getClientById(clientId, token) {
  return simulateDelay(200).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    const client = defaultClients.find((c) => c._id === Number(clientId));
    if (!client) {
      return Promise.reject(new Error("Client not found"));
    }
    return Promise.resolve(client);
  });
}

// Add a new client
function addClient(clientData, token) {
  return simulateDelay(500).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    const newClient = {
      _id: Date.now(), // Generate unique ID
      name: clientData.name,
      medications: [],
      createdAt: new Date().toISOString(),
    };
    return Promise.resolve(newClient);
  });
}

// Update a client
function updateClient(clientId, clientData, token) {
  return simulateDelay(500).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    const updatedClient = {
      _id: clientId,
      ...clientData,
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(updatedClient);
  });
}

// Delete a client
function deleteClient(clientId, token) {
  return simulateDelay(400).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    return Promise.resolve({ message: "Client deleted successfully" });
  });
}

// Add a medication to a client
function addMedication(clientId, medicationData, token) {
  return simulateDelay(500).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    const newMedication = {
      id: Date.now(), // Generate unique ID
      name: medicationData.name,
      times: medicationData.times,
      createdAt: new Date().toISOString(),
    };
    return Promise.resolve(newMedication);
  });
}

// Update a medication
function updateMedication(clientId, medicationId, medicationData, token) {
  return simulateDelay(500).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    const updatedMedication = {
      id: medicationId,
      ...medicationData,
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(updatedMedication);
  });
}

// Delete a medication
function deleteMedication(clientId, medicationId, token) {
  return simulateDelay(400).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    return Promise.resolve({ message: "Medication deleted successfully" });
  });
}

// Save medication administration record
function saveMedicationAdministration(administrationData, token) {
  return simulateDelay(300).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    // In real app, this would save to backend
    // For now, we're using localStorage directly in components
    return Promise.resolve({
      message: "Administration saved successfully",
      data: administrationData,
    });
  });
}

// Get medication administration records
function getMedicationAdministrations(clientId, month, year, token) {
  return simulateDelay(300).then(() => {
    if (!token) {
      return Promise.reject(new Error("Unauthorized: No token provided"));
    }
    const storageKey = `administrations_${clientId}_${month}_${year}`;
    const saved = localStorage.getItem(storageKey);
    return Promise.resolve(saved ? JSON.parse(saved) : {});
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
