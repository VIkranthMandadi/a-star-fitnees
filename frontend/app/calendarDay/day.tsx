import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-paper";
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
  const [expandedWorkoutIndex, setExpandedWorkoutIndex] = useState<
    number | null
  >(null);
  const user_email = user?.emailAddresses[0]?.emailAddress;

  const selectedDay = Array.isArray(day) ? day[0] : day;

  useEffect(() => {
    const fetchWorkoutData = async () => {
      setLoading(true);
      try {
        var scheduledData = null;
        let existingWorkouts = null;

        if (user_email) {
          scheduledData = await getScheduledWorkout(user_email, selectedDay);
        }

        if (scheduledData) {
          setScheduledWorkout(scheduledData.scheduledWorkout);
        } else {
          if (user_email) {
            existingWorkouts = await fetchUserWorkouts(user_email);
          }
          setAvailableWorkouts(existingWorkouts?.workouts || []);
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

  const handleSelectWorkout = async (workoutName: string) => {
    try {
      if (user_email) {
        const selectedWorkout =
          availableWorkouts.find((workout) => workout.name === workoutName) ||
          null;
        if (selectedWorkout) {
          await scheduleWorkout(user_email, selectedDay, selectedWorkout);
          setScheduledWorkout(selectedWorkout);
        }
      }
    } catch (error) {
      console.error("Error scheduling workout:", error);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedWorkoutIndex(index === expandedWorkoutIndex ? null : index);
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white pt-10 px-3`}>
      <View style={tw`mb-4 p-4 bg-primary`}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={tw`border-gray-200 bg-white`}
        >
          Go back
        </Button>
      </View>
      {scheduledWorkout ? (
        <>
          <Text style={tw`text-2xl font-bold text-primary mb-2`}>
            Scheduled Workout for {selectedDay}
          </Text>
          <Text style={tw`text-lg font-semibold text-secondary mb-4`}>
            {scheduledWorkout.name}
          </Text>
          <Text style={tw`text-base text-gray-600 mb-4`}>
            {scheduledWorkout.description}
          </Text>

          <FlatList
            data={scheduledWorkout.exercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={tw`mb-4`}>
                <TouchableOpacity onPress={() => toggleExpand(index)}>
                  <View style={tw`bg-gray-100 p-4 rounded-lg shadow-base`}>
                    <Text style={tw`text-lg font-semibold text-primary`}>
                      {item.name}
                    </Text>
                    <Text style={tw`text-gray-600`}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
                {expandedWorkoutIndex === index && (
                  <View style={tw`mt-2 bg-gray-200 p-4 rounded-lg`}>
                    <Text style={tw`font-semibold text-primary`}>
                      {item.name} ({item.sets} sets x {item.reps} reps)
                    </Text>
                    <Text style={tw`text-gray-700`}>{item.description}</Text>
                  </View>
                )}
              </View>
            )}
          />
        </>
      ) : (
        <View style={tw`p-4`}>
          <Text style={tw`text-2xl font-bold text-primary`}>
            No Workout Scheduled for {selectedDay}
          </Text>
          <Text style={tw`text-xl mt-4 mb-4 text-gray-700`}>
            Choose a workout to schedule:
          </Text>
          <FlatList
            data={availableWorkouts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={tw`mb-4`}>
                <TouchableOpacity onPress={() => toggleExpand(index)}>
                  <View style={tw`bg-gray-100 p-4 rounded-lg shadow-base`}>
                    <Text style={tw`text-lg font-semibold text-primary`}>
                      {item.name}
                    </Text>
                    <Text style={tw`text-gray-600`}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
                {expandedWorkoutIndex === index && (
                  <View style={tw`mt-2 bg-gray-200 p-4 rounded-lg`}>
                    {item.exercises.map(
                      (exercise: any, exerciseIndex: number) => (
                        <View key={exerciseIndex} style={tw`mb-2`}>
                          <Text style={tw`font-semibold text-primary`}>
                            {exercise.name} ({exercise.sets} sets x{" "}
                            {exercise.reps} reps)
                          </Text>
                          <Text style={tw`text-gray-700`}>
                            {exercise.description}
                          </Text>
                        </View>
                      )
                    )}
                    <Button
                      mode="contained"
                      onPress={() => handleSelectWorkout(item.name)}
                      style={tw`mt-2 bg-primary`}
                    >
                      Choose Workout
                    </Button>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}