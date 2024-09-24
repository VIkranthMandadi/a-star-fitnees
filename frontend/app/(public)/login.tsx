import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  Alert,
  TouchableOpacity
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Login(){
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

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
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
                <Icon name={showPassword ? "visibility" : "visibility-off"} size={24} color="#6c47ff" />
              </TouchableOpacity>
      </View>

      <TouchableOpacity
            onPress={onSignInPress}
            style={styles.button} 
          >
            <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.createAccountLink}>Create Account</Text>
            </TouchableOpacity>
      </View>

      <Link href="/reset" asChild>
        <Pressable>
          <Text style={styles.forgotPass}>Forgot password?</Text>
        </Pressable>
      </Link>

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
  forgotPass: {
    flexDirection: 'row', 
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,   
    color: '#6c47ff', 
    fontWeight: 'bold',
  },
  createAccountContainer: {
    flexDirection: 'row', 
    textAlign: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    fontSize: 16,   
    color: '#000',
  },
  createAccountLink: {
    fontSize: 16,
    color: '#6c47ff', 
    fontWeight: 'bold', 
  },
  iconContainer: {
    position: 'absolute', 
    right: 10, 
    top: 13, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
});
