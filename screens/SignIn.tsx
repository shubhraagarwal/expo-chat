import { View, Text, Pressable, TextInput } from "react-native";
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

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <TextInput
        value={credentials.email}
        onChangeText={(e) => setCredentials({ ...credentials, email: e })}
        style={{ borderWidth: 1, borderColor: "black" }}
      />
      <TextInput
        value={credentials.password}
        onChangeText={(e) => setCredentials({ ...credentials, password: e })}
        style={{ borderWidth: 1, borderColor: "black" }}
      />
      <Pressable
        onPress={() =>
          signInWithEmail({
            email: credentials.email,
            password: credentials.password,
          })
        }
      >
        <Text style={{ color: "black" }}>Sign sIn</Text>
      </Pressable>

      <Pressable onPress={signInWithGoogle}>
        <Text>Google signin</Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
