// src/components/Workout.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import tw from "twrnc";
import Exercise from "./Exercise";

interface WorkoutProps {
  name: string;
  description: string;
  exercises: any[];
}

const Workout: React.FC<WorkoutProps> = ({ name, description, exercises }) => {
  return (
    <View style={tw`p-4 bg-gray-100 flex-1`}>
      <Text style={tw`text-xl font-semibold mb-2`}>{name}</Text>
      <Text style={tw`text-base mb-4`}>{description}</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Exercise
            name={item.name}
            sets={item.sets}
            reps={item.reps}
            description={item.description}
          />
        )}
        contentContainerStyle={tw`p-2`}
      />
    </View>
  );
};

export default Workout;