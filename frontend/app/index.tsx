// import React from "react";
// import { View, Text } from "react-native";
// import { Button } from "react-native-paper";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useRouter } from "expo-router"; // Import useRouter for navigation
// import tw from "twrnc";

// export default function startScreen() {

//   const router = useRouter(); // Get the router object

//   return (
//     <View style={tw`flex-1 justify-center px-8 bg-white`}>
//       {/* Logo */}
//       <View style={tw`items-center mb-8`}>
//         <Ionicons name="lock-closed-outline" size={64} color="black" />
//         <Text style={tw`text-3xl font-bold mt-4`}>Welcome</Text>
//       </View>

//       {/* Login Button */}
//       <Button
//         mode="contained"
//         style={tw`mt-4`}
//         onPress={() => router.push("/auth/login")} // Navigate to auth/login
//       >
//         Login
//       </Button>

//       {/* Sign Up Button */}
//       <Button
//         mode="outlined"
//         style={tw`mt-4`}
//         onPress={() => router.push("/auth/signUp")} // Navigate to auth/signUp
//       >
//         Sign Up
//       </Button>
//     </View>
//   );
// }

import { ActivityIndicator, Text } from "react-native-paper";
import { View } from "react-native";

export default function startPage() { 
    
    return (
        <View>
            <Text>Hello World</Text>
        </View>
        
    );
};
