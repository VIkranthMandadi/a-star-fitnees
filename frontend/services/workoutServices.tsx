import axios from "axios";

// Set the baseURL for your backend API
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Updated baseURL
});


// Function to get premade workouts
export const fetchPremadeWorkouts = async () => {
  try {
    const response = await api.get("/get-premade-workouts");
    return response.data;
  } catch (error) {
    console.error("Error creating user collection:", error);
    throw error;
  }
};
