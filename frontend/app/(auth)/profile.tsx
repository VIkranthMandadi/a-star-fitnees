import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons"; // For pencil icon
import axios from "axios";

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

  // Initial values are typed as `string` and use fallback values like 'null' or an empty string
  const [firstName, setFirstName] = useState<string>(user?.firstName || "null");
  const [lastName, setLastName] = useState<string>(user?.lastName || "null");
  const [username, setUsername] = useState<string>(user?.username || "null");
  const [age, setAge] = useState<string>("null");
  const [weight, setWeight] = useState<string>("null");
  const [height, setHeight] = useState<string>("null");
  const [isEditing, setIsEditing] = useState<keyof ProfileData | null>(null); // `null` means no field is being edited

  const handleEdit = (field: keyof ProfileData) => {
    setIsEditing(field); // Set which field is being edited
  };

  const handleSave = async () => {
    try {
      const updatedProfileData: ProfileData = {
        firstName,
        lastName,
        username,
        age,
        weight,
        height,
      };

      // Typing the response to ensure proper types when handling axios requests
      const response = await axios.post<{ message: string }>(
        "http://localhost:8000/update-profile",
        {
          email: user?.emailAddresses[0].emailAddress, // Assuming you have the email in the Clerk user object
          profileData: updatedProfileData,
        }
      );

      console.log("Profile updated:", response.data);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
    setIsEditing(null); // Stop editing after saving
  };

  const renderEditableField = (
    label: string,
    value: string,
    field: keyof ProfileData,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}:</Text>
      {isEditing === field ? (
        <TextInput
          value={value === "null" ? "" : value}
          onChangeText={setter}
          style={styles.inputField}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
      <TouchableOpacity onPress={() => handleEdit(field)}>
        <FontAwesome name="pencil" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderEditableField("First Name", firstName, "firstName", setFirstName)}
      {renderEditableField("Last Name", lastName, "lastName", setLastName)}
      {renderEditableField("Username", username, "username", setUsername)}
      {renderEditableField("Age", age, "age", setAge)}
      {renderEditableField("Weight (kg)", weight, "weight", setWeight)}
      {renderEditableField("Height (cm)", height, "height", setHeight)}

      {isEditing && <Button title="Save" onPress={handleSave} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  value: {
    fontSize: 16,
    flex: 3,
  },
  inputField: {
    borderBottomWidth: 1,
    flex: 3,
    marginRight: 10,
  },
});
