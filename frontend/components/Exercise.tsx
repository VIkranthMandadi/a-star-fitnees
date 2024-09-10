import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

// Define the props interface
interface ExerciseProps {
  name: string;
  sets: number;
  reps: number;
  description: string;
}

const Exercise: React.FC<ExerciseProps> = ({ name, sets, reps, description }) => {
  return (
    <View style={tw`p-4 bg-white rounded-lg shadow-lg mb-4`}>
      <Text style={tw`text-lg font-semibold mb-2`}>{name}</Text>
      <Text style={tw`text-base`}>Sets: {sets}</Text>
      <Text style={tw`text-base mb-2`}>Reps: {reps}</Text>
      <Text style={tw`text-gray-600`}>{description}</Text>
    </View>
  );
};

export default Exercise;
