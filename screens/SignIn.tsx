import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../hooks/useAuth";
import { SignInWithEmail } from "../types";

const SignIn = () => {
  const provider = new GoogleAuthProvider();

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

  const signUpUserAndLogin = ({ email, password }: SignInWithEmail) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user, "userCreated");
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

  useEffect(() => {
    signInWithEmail({
      email: "def@abc.com",
      password: "123456",
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text style={{ color: "black" }}>Sign sIn</Text>

      <Pressable onPress={signInWithGoogle}>
        <Text>Google signin</Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
