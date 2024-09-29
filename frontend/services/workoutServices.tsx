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

export const updatePlan = async (email: string, workout: any) => {
  try {

    const response = await api.post("/update-plan", {
      email,
      workout,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating plan:", error);
    throw error;
  }
};

// Function to fetch the user's existing workouts
export const fetchUserWorkouts = async (email: string) => {
  try {

    const response = await api.get("/get-user-workouts", {
      params: {email}
    });
    return response.data; // Returns the array of workouts
  } catch (error) {
    console.error('Error fetching user workouts:', error);
    throw error;
  }
};

// Fetch the scheduled workout for a specific day
export const getScheduledWorkout = async (email: string, day: string) => {
  try {
    const response = await api.get("/workouts/scheduled", {
      params: { email, day },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching scheduled workout:', error);
    throw error;
  }
};

// Schedule a workout for a specific day
export const scheduleWorkout = async (email: string, day: string, workoutId: string) => {
  try {

    const response = await api.post("/workouts/schedule", {
      email,
      day,
      workoutId
    });
    return response.data;
  } catch (error) {
    console.error('Error scheduling workout:', error);
    throw error;
  }
};
