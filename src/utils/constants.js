// Example clients data (will eventually come from API)
export const defaultClients = [
  {
    _id: 1,
    name: "John Smith",
    medications: [
      { id: 1, name: "Aspirin 81mg", times: ["AM"] },
      { id: 2, name: "Metformin 500mg", times: ["AM", "PM"] },
      { id: 3, name: "Lisinopril 10mg", times: ["AM"] },
    ],
  },
  {
    _id: 2,
    name: "Sarah Johnson",
    medications: [
      { id: 4, name: "Levothyroxine 50mcg", times: ["AM"] },
      { id: 5, name: "Atorvastatin 20mg", times: ["Bedtime"] },
    ],
  },
  {
    _id: 3,
    name: "Michael Davis",
    medications: [
      { id: 6, name: "Omeprazole 20mg", times: ["AM"] },
      { id: 7, name: "Amlodipine 5mg", times: ["AM"] },
      { id: 8, name: "Gabapentin 300mg", times: ["AM", "Noon", "PM"] },
    ],
  },
  {
    _id: 4,
    name: "Emily Wilson",
    medications: [
      { id: 9, name: "Sertraline 50mg", times: ["AM"] },
      { id: 10, name: "Vitamin D 1000IU", times: ["AM"] },
    ],
  },
];

// Base URL for API (will be used when backend is implemented)
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.meditrack.com"
    : "http://localhost:3001";
