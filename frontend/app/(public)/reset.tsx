import { View, StyleSheet, TextInput, Button, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

export default function PwReset(){
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();

  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    try {
      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      console.log(result);
      alert("Password reset successfully");

      // Set the user session active, which will log in the user automatically
      await setActive!({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      {!successfulCreation && (
        <>
        <View style={styles.inputContainer}>
        <TextInput
            autoCapitalize="none"
            placeholder="simon@galaxies.dev"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
        </View>
          <TouchableOpacity
              onPress={onRequestReset}
              style={styles.button} 
            >
              <Text style={styles.buttonText}>Send Reset Email</Text>
          </TouchableOpacity>
        </>
      )}

      {successfulCreation && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              style={styles.inputField}
              onChangeText={setCode}
            />
            <TextInput
              placeholder="New password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.inputField}
            />
          </View>
          <Button
            onPress={onReset}
            title="Set new Password"
            color={"#6c47ff"}
          ></Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    borderWidth: 0,
    borderColor: "#6c47ff",
    borderStyle: 'solid',
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10, 
    paddingVertical: 0,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    position: 'relative',
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 12,
    marginVertical: 4,
    height: 50,
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: 'row',  
    justifyContent: 'center', 
    margin: 8,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6c47ff',
    borderColor: '#6c47ff',
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',  
    color: '#fff', 
  },
});
