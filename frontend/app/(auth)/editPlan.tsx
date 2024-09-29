import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList } from "react-native";
import { Button } from "react-native-paper";
import {
  fetchPremadeWorkouts,
  updatePlan,
  fetchUserWorkouts,
} from "@/services/workoutServices";
import Workout from "@/components/Workout";
import tw from "twrnc";
import { useUser } from "@clerk/clerk-expo"; // Assuming you're using Clerk for auth

export default function EditPlan() {
  const { user } = useUser(); // Get the logged-in user's info
  const [modalVisible, setModalVisible] = useState(false);
  const [premadeModalVisible, setPremadeModalVisible] = useState(false);
  const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
  const [expandedWorkoutIndex, setExpandedWorkoutIndex] = useState<
    number | null
  >(null); // For tracking the expanded workout index
  const [premadeWorkouts, setPremadeWorkouts] = useState<any[]>([]);
  const [userWorkouts, setUserWorkouts] = useState<any[]>([]); // Store user's existing workouts

  useEffect(() => {
    const loadPremadeWorkouts = async () => {
      try {
        const workouts = await fetchPremadeWorkouts();
        setPremadeWorkouts(workouts);
      } catch (error) {
        console.error("Error loading premade workouts:", error);
      }
    };

    const loadUserWorkouts = async () => {
      try {
        if (user?.emailAddresses[0]?.emailAddress) {
          const existingWorkouts = await fetchUserWorkouts(
            user.emailAddresses[0].emailAddress
          );
          console.log(JSON.stringify(existingWorkouts, null, 2));
          setUserWorkouts(existingWorkouts.workouts); // Populate the selected workouts with the user's saved ones
        }
      } catch (error) {
        console.error("Error loading the user's existing workouts:", error);
      }
    };

    loadPremadeWorkouts();
    loadUserWorkouts();
  }, [user]);

  const handleWorkoutSelect = async (workout: any) => {
    try {
      setSelectedWorkouts([...selectedWorkouts, workout]);

      // Update the plan in MongoDB for the logged-in user
      if (user && user?.emailAddresses[0].emailAddress) {
        await updatePlan(user?.emailAddresses[0].emailAddress, workout);

        // Re-fetch the updated workouts after adding the new one
        const updatedWorkouts = await fetchUserWorkouts(
          user.emailAddresses[0].emailAddress
        );
        setUserWorkouts(updatedWorkouts.workouts); // Update state to reflect new workout
      }

      setPremadeModalVisible(false);
    } catch (error) {
      console.error("Error adding workout to plan:", error);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedWorkoutIndex(expandedWorkoutIndex === index ? null : index);
  };

  const handleRemoveWorkout = (index: number) => {
    setSelectedWorkouts(selectedWorkouts.filter((_, i) => i !== index));
  };

  return (
    <>
      <FlatList
        data={userWorkouts} // Use user's existing workouts
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={tw`mb-4`}>
            {/* Touchable workout item */}
            <TouchableOpacity onPress={() => toggleExpand(index)}>
              <View style={tw`bg-gray-100 p-4 rounded-lg`}>
                {/* Display workout name and description */}
                <Text style={tw`text-lg font-semibold`}>{item.name}</Text>
                <Text style={tw`text-gray-600`}>{item.description}</Text>
              </View>
            </TouchableOpacity>

            {/* Expanded workout details */}
            {expandedWorkoutIndex === index && (
              <View style={tw`mt-2 bg-gray-200 p-4 rounded-lg`}>
                {item.exercises.map((exercise: any, exerciseIndex: number) => (
                  <View key={exerciseIndex} style={tw`mb-2`}>
                    <Text style={tw`font-semibold`}>
                      {exercise.name} ({exercise.sets} sets x {exercise.reps}{" "}
                      reps)
                    </Text>
                    <Text style={tw`text-gray-700`}>
                      {exercise.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Remove workout button */}
            <Button
              mode="outlined"
              onPress={() => handleRemoveWorkout(index)}
              style={tw`mt-2`}
            >
              Remove Workout
            </Button>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={tw`p-4`}>
            <Text style={tw`text-center text-gray-600`}>
              There are no workouts in your plan currently.
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <Button mode="contained" onPress={() => setModalVisible(true)}>
            Add Workout
          </Button>
        )}
        contentContainerStyle={tw`p-4`}
      />

      {/* Main Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`m-4 p-6 bg-white rounded-lg shadow-lg w-5/6`}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={tw`absolute top-2 right-2`}
            >
              <Text style={tw`text-xl font-bold text-gray-600`}>X</Text>
            </TouchableOpacity>

            <Text style={tw`text-lg font-semibold mb-4 text-center`}>
              Choose an option:
            </Text>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setPremadeModalVisible(true);
              }}
              style={tw`py-2 px-4 rounded-lg mb-3`}
            >
              <Button mode="contained">Choose Premade Workout</Button>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                // Handle "Create New Workout" logic here
              }}
              style={tw`py-2 px-4 rounded-lg mb-3`}
            >
              <Button mode="contained">Create New Workout</Button>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                // Handle "Choose Preexisting Workout" logic here
              }}
              style={tw`py-2 px-4 rounded-lg`}
            >
              <Button mode="contained">Choose Preexisting Workout</Button>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Premade Workouts Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={premadeModalVisible}
        onRequestClose={() => setPremadeModalVisible(!premadeModalVisible)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`m-4 p-6 bg-white rounded-lg shadow-lg w-5/6`}>
            <Text style={tw`text-lg font-semibold mb-4 text-center`}>
              Select a Premade Workout:
            </Text>
            <FlatList
              data={premadeWorkouts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`py-4 px-6 mb-4 bg-gray-200 rounded-lg`}
                  onPress={() => handleWorkoutSelect(item)}
                >
                  <Text style={tw`text-lg font-semibold`}>{item.name}</Text>
                  <Text style={tw`text-sm text-gray-700`}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={tw`p-2`}
            />
            <Button
              mode="contained"
              onPress={() => setPremadeModalVisible(false)}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}