import React from "react";
import { useAuthentication } from "../hooks/useAuth";
import UserStack from "./userStack";
import AuthStack from "./authStack";

export default function RootNav() {
  const { user } = useAuthentication();

  return user ? <UserStack /> : <AuthStack />;
  //   return <AuthStack />;
}
