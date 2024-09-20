import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Button } from "react-native-paper";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Workout from "@/components/Workout";
import tw from "twrnc";

// Import the JSON files
const pushWorkout = require("../../assets/PremadeWorkouts/Push.json");
const pullWorkout = require("../../assets/PremadeWorkouts/Pull.json");
const legsWorkout = require("../../assets/PremadeWorkouts/Legs.json");
const testWorkout = require("../../assets/PremadeWorkouts/test.json");
const testWorkout2 = require("../../assets/PremadeWorkouts/test2.json");

export default function EditPlan() {
  const [modalVisible, setModalVisible] = useState(false);
  const [premadeModalVisible, setPremadeModalVisible] = useState(false);
  const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
  const [expandedWorkoutIndex, setExpandedWorkoutIndex] = useState<
    number | null
  >(null);

  const premadeWorkouts = [
    {
      name: pushWorkout.name,
      description: pushWorkout.description,
      exercises: pushWorkout.exercises,
    },
    {
      name: pullWorkout.name,
      description: pullWorkout.description,
      exercises: pullWorkout.exercises,
    },
    {
      name: legsWorkout.name,
      description: legsWorkout.description,
      exercises: legsWorkout.exercises,
    },
    {
      name: testWorkout.name,
      description: testWorkout.description,
      excercises: testWorkout.excercises
    },
    {
      name: testWorkout2.name,
      description: testWorkout2.description,
      excercises: testWorkout2.excercises
    }
  ];

  const handleWorkoutSelect = (workout: any) => {
    setSelectedWorkouts([...selectedWorkouts, workout]);
    setPremadeModalVisible(false);
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
        data={selectedWorkouts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={tw`mb-4`}>
            <TouchableOpacity onPress={() => toggleExpand(index)}>
              <Workout
                name={item.name}
                description={item.description}
                exercises={expandedWorkoutIndex === index ? item.exercises : []}
              />
            </TouchableOpacity>
            <Button
              mode="outlined"
              onPress={() => handleRemoveWorkout(index)}
              style={tw`mt-2`}
            >
              Remove Workout
            </Button>
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