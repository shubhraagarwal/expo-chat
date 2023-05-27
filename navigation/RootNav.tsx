import React from "react";
import { useAuthentication } from "../hooks/useAuth";
import UserStack from "./userStack";
import AuthStack from "./authStack";
import { Box, View } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootNav() {
  const { user } = useAuthentication();
  return user ? <UserStack /> : <AuthStack />;
}
