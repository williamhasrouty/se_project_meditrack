// OpenFDA API utilities
// Documentation: https://open.fda.gov/apis/drug/label/

const FDA_BASE_URL = "https://api.fda.gov/drug/label.json";

// Helper function to check response status
function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

// Search for medication information by brand name
function getMedicationByBrandName(brandName) {
  return fetch(
    `${FDA_BASE_URL}?search=openfda.brand_name:"${brandName}"&limit=1`
  ).then(checkResponse);
}

// Search for medication information by generic name
function getMedicationByGenericName(genericName) {
  return fetch(
    `${FDA_BASE_URL}?search=openfda.generic_name:"${genericName}"&limit=1`
  ).then(checkResponse);
}

// Parse medication data from FDA API response
function parseMedicationData(apiResponse, fallbackName) {
  if (!apiResponse.results || apiResponse.results.length === 0) {
    return {
      brandName: fallbackName,
      genericName: "Information not available",
      purpose: "Information not available",
      warnings: "Information not available",
      dosageAndAdministration: "Information not available",
      activeIngredient: "Information not available",
    };
  }

  const result = apiResponse.results[0];
  return {
    brandName: result.openfda?.brand_name?.[0] || fallbackName,
    genericName: result.openfda?.generic_name?.[0] || "N/A",
    purpose: result.purpose?.[0] || "N/A",
    warnings: result.warnings?.[0] || "N/A",
    dosageAndAdministration: result.dosage_and_administration?.[0] || "N/A",
    activeIngredient:
      result.active_ingredient?.[0] ||
      result.openfda?.substance_name?.[0] ||
      "N/A",
  };
}

export {
  getMedicationByBrandName,
  getMedicationByGenericName,
  parseMedicationData,
};
