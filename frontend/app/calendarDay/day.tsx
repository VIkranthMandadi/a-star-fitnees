import React from "react";
import { View, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import tw from "twrnc";

export default function workoutPage() {
  const { day } = useLocalSearchParams(); // Extract the selected day from the route

  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Text style={tw`text-2xl font-bold`}>Workout for {day}</Text>
      {/* Add logic to fetch and display the workouts for this day */}
    </View>
  );
}
