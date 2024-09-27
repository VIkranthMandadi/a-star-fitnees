import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { createUserCollection } from "@/services/userServices";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Register(){
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    //Checking if the passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Attempt email address verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // Set the user session as active
      await setActive({ session: completeSignUp.createdSessionId });

      // Create a user-specific collection
      const userEmail = completeSignUp.emailAddress; // Get the user's email

      if (!userEmail) {
        throw new Error("User email is required to create a collection.");
      }

      console.log(userEmail);
      createUserCollection({ email: userEmail })
        .then((response) => console.log(response))
        .catch((error) => console.error(error));; // Call the service to create a collection

      alert("Verification successful and user collection created!"); // Success message
    } catch (err: any) {
      alert(err.errors[0]?.message || "An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />
      {!pendingVerification && (
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

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.inputField}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconContainer}
            >
              <Icon
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#6c47ff"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.inputField}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.iconContainer}
            >
              <Icon
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#6c47ff"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {pendingVerification && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              value={code}
              placeholder="Code..."
              style={styles.inputField}
              onChangeText={setCode}
            />
          </View>
          <TouchableOpacity onPress={onPressVerify} style={styles.button}>
            <Text style={styles.buttonText}>Verify Email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingVertical: 24,
    paddingHorizontal: 10,
    justifyContent: "center",
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
  inputField: {
    marginVertical: 4,
    height: '100%',
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
  iconContainer: {
    position: 'absolute', 
    right: 10, 
    top: 13, 
    justifyContent: 'center', 
    alignItems: 'center', 
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
  signInContainer: {
    flexDirection: 'row', 
    textAlign: 'center',
    justifyContent: 'center',
  },
  signInText: {
    fontSize: 16,   
    color: '#000',
  },
  signInLink: {
    fontSize: 16,
    color: '#6c47ff', 
    fontWeight: 'bold', 
  },
});

