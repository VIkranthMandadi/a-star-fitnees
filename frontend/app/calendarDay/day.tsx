import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Workout from "@/components/Workout";
import tw from "twrnc";
import {
  fetchUserWorkouts,
  getScheduledWorkout,
  scheduleWorkout,
} from "@/services/workoutServices";
import { useUser } from "@clerk/clerk-expo";

export default function WorkoutPage() {
  const { day } = useLocalSearchParams();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [scheduledWorkout, setScheduledWorkout] = useState<any | null>(null);
  const [availableWorkouts, setAvailableWorkouts] = useState<any[]>([]);
  const user_email = user?.emailAddresses[0]?.emailAddress; // Dynamic email

  const selectedDay = Array.isArray(day) ? day[0] : day;

  useEffect(() => {
    const fetchWorkoutData = async () => {
      setLoading(true); // Start loading
      try {
        var existingWorkouts = null;
        var scheduledData = null;
        // Fetch scheduled workout for the selected day
        if (user_email) { 
          scheduledData = await getScheduledWorkout(user_email, selectedDay);

        }
        

        // Check if scheduledData exists and has a workout
        if (scheduledData && scheduledData.scheduledWorkout) {
          setScheduledWorkout(scheduledData.scheduledWorkout);
        } else {
          // If no workout is scheduled, fetch available workouts
          if (user_email) {
            existingWorkouts = await fetchUserWorkouts(user_email);
          }
          
          setAvailableWorkouts(existingWorkouts.workouts || []); // Safely handle case where workouts might be undefined
        }
      } catch (error) {
        console.error("Error fetching workout data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user_email) {
      fetchWorkoutData();
    }
  }, [day, user_email]);

  const handleSelectWorkout = async (workoutId: string) => {
    try {
      // Schedule the selected workout for the day
      if (user_email) {
        await scheduleWorkout(user_email, selectedDay, workoutId);
      }

      // Find the selected workout in the availableWorkouts array by name
      const selectedWorkout =
        availableWorkouts.find((workout) => workout.id === workoutId) ||
        null;

      // Update the state with the selected workout (or null if not found)
      setScheduledWorkout(selectedWorkout);
    } catch (error) {
      console.error("Error scheduling workout:", error);
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Button title="Go Back" onPress={() => router.back()} />
      {scheduledWorkout ? (
        <View>
          <Text style={tw`text-2xl font-bold`}>
            Scheduled Workout for {selectedDay}
          </Text>
          <Text>{scheduledWorkout.name}</Text>
          {/* Add more workout details here if needed */}
        </View>
      ) : (
        <View>
          <Text style={tw`text-2xl font-bold`}>
            No Workout Scheduled for {selectedDay}
          </Text>
          <Text>Choose a workout to schedule:</Text>
          <FlatList
            data={availableWorkouts}
            keyExtractor={(item) => item.name} // Use workout name as the key
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectWorkout(item.name)} // Use workout name for selection
                style={tw`p-4 bg-gray-200 mt-2`}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}