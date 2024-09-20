import axios from "axios";

// Set the baseURL for your backend API
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Updated baseURL
});

// Define the type for user data
interface User {
  email: string;
}

// Function to create a new user-specific collection
export const createUserCollection = async (user: User) => {
  try {
    const response = await api.post("/create-user-collection", user);
    return response.data;
  } catch (error) {
    console.error("Error creating user collection:", error);
    throw error;
  }
};