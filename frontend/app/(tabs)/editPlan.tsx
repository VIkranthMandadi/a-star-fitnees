import {
  Image,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Button } from "react-native-paper";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import tw from "twrnc";

export default function EditPlan() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image source={require("@/assets/images/partial-react-logo.png")} />
      }
    >
      <View style={tw`p-4`}>
        <Button mode="contained" onPress={() => setModalVisible(true)}>
          Add Workout
        </Button>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          >
            <View style={tw`m-4 p-6 bg-white rounded-lg shadow-lg w-5/6`}>
              <Text style={tw`text-lg font-semibold mb-4 text-center`}>
                Choose an option:
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  // Handle "Choose Premade Workout" logic here
                }}
                style={tw`py-2 px-4 rounded-lg mb-3`}
              >
                <Button mode="contained">Choose Premade Workout</Button>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  // Handle "Create New Workout" logic here
                }}
                style={tw`py-2 px-4 rounded-lg mb-3`}
              >
                <Button mode="contained">Create New Workout</Button>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  // Handle "Choose Preexisting Workout" logic here
                }}
                style={tw`py-2 px-4 rounded-lg`}
              >
                <Button mode="contained">Choose Preexisting Workout</Button>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ParallaxScrollView>
  );
}
