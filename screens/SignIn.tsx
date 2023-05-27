import { View, Pressable, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../hooks/useAuth";
import { SignInWithEmail } from "../types";
import { db } from "../firebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Input, Stack, Text } from "native-base";

const SignIn = () => {
  const provider = new GoogleAuthProvider();
  const [credentials, setCredentials] = useState<SignInWithEmail>({
    email: "",
    password: "",
  });

  const signInWithEmail = ({ email, password }: SignInWithEmail) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode === "auth/user-not-found") {
          signUpUserAndLogin({ email, password });
        }
      });
    return null;
  };

  const signUpUserAndLogin = async ({ email, password }: SignInWithEmail) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user, "userCreated");
        try {
          const docRef = await setDoc(doc(db, "users", email), {
            email,
          });
          console.log("Document written with ID: ", docRef);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const insets = useSafeAreaInsets();

  return (
    <Box
      backgroundColor={"primary"}
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      paddingX={11}
      justifyContent={"center"}
    >
      <Stack
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.6,
          shadowRadius: 2,
        }}
        padding={5}
        background={"white"}
        borderRadius={10}
        space={5}
      >
        <Input
          value={credentials.email}
          onChangeText={(e) => setCredentials({ ...credentials, email: e })}
          placeholder="Please input your email"
          backgroundColor={"white"}
          size={"xl"}
          borderRadius={10}
          borderColor={"black"}
          placeholderTextColor={"gray.500"}
        />
        <Input
          value={credentials.password}
          onChangeText={(e) => setCredentials({ ...credentials, password: e })}
          placeholder="Please input your password"
          backgroundColor={"white"}
          size={"xl"}
          type="password"
          borderRadius={10}
          borderColor={"black"}
          placeholderTextColor={"gray.500"}
        />
        <Pressable
          onPress={() =>
            signInWithEmail({
              email: credentials.email,
              password: credentials.password,
            })
          }
        >
          <Box
            borderWidth={1}
            borderColor={"black"}
            borderRadius={10}
            backgroundColor="#99E1FE"
            padding={5}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 1,
              shadowRadius: 2,
            }}
          >
            <Text
              alignSelf={"center"}
              fontWeight={600}
              style={{ color: "black" }}
            >
              Let me in
            </Text>
          </Box>
        </Pressable>
      </Stack>
    </Box>
  );
};

export default SignIn;
