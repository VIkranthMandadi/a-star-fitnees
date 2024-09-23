import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { updateUserProfile } from "@/services/userServices";
import tw from "twrnc"; // Importing Tailwind for React Native

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  age: string;
  weight: string;
  height: string;
}

export default function Profile() {
  const { user } = useUser();

  const [firstName, setFirstName] = useState<string>(user?.firstName || "null");
  const [lastName, setLastName] = useState<string>(user?.lastName || "null");
  const [username, setUsername] = useState<string>(user?.username || "null");
  const [age, setAge] = useState<string>("null");
  const [weight, setWeight] = useState<string>("null");
  const [height, setHeight] = useState<string>("null");
  const [isEditing, setIsEditing] = useState<keyof ProfileData | null>(null);

  const handleEdit = (field: keyof ProfileData) => {
    setIsEditing(field);
  };

  const handleSave = async () => {
    try {

      if (!user?.emailAddresses[0].emailAddress) {
        throw new Error("User email is missing");
      }
      
      const updatedProfileData: ProfileData = {
        firstName,
        lastName,
        username,
        age,
        weight,
        height,
      };

      await updateUserProfile(
        user?.emailAddresses[0].emailAddress,
        updatedProfileData
      );

      console.log("Profile updated successfully.");
    } catch (error) {
      console.log("Error updating profile:", error);
    }
    setIsEditing(null);
  };


  const renderEditableField = (
    label: string,
    value: string,
    field: keyof ProfileData,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <View style={tw`flex-row items-center my-3`}>
      <Text style={tw`text-sm font-semibold flex-1 text-gray-800`}>
        {label}:
      </Text>
      {isEditing === field ? (
        <TextInput
          value={value === "null" ? "" : value}
          onChangeText={setter}
          style={tw`flex-3 border-b border-gray-300 text-base`}
        />
      ) : (
        <Text
          style={tw`text-sm flex-3 text-gray-600 m-3`}
          numberOfLines={1} // Ensure only one line is shown
          ellipsizeMode="tail" // Truncate text with ellipsis if it's too long
        >
          {value === "null" ? "N/A" : value}
        </Text>
      )}
      <TouchableOpacity onPress={() => handleEdit(field)}>
        <FontAwesome name="pencil" size={20} color="black" style={tw`ml-3`} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 justify-center p-6 bg-white`}>
      <Image
        source={{
          uri: user?.imageUrl || "https://via.placeholder.com/100",
        }}
        style={tw`w-24 h-24 rounded-full self-center mb-6`}
      />

      {renderEditableField("First Name", firstName, "firstName", setFirstName)}
      {renderEditableField("Last Name", lastName, "lastName", setLastName)}
      {renderEditableField("User\nname", username, "username", setUsername)}
      {renderEditableField("Age", age, "age", setAge)}
      {renderEditableField("Weight (kg)", weight, "weight", setWeight)}
      {renderEditableField("Height (cm)", height, "height", setHeight)}

      {isEditing && (
        <Button title="Save" onPress={handleSave} color="#6c47ff" />
      )}
    </View>
  );
}