// src/services/api.ts

// src/services/api.ts
export const fetchDeveloperActivity = async () => {
  const response = await fetch("http://localhost:3000/api/developer-activity");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
