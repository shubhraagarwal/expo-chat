import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../hooks/useAuth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    const docSnap = await getDocs(collection(db, "users"));
    docSnap.forEach((doc) => {
      if (doc.data().email !== auth.currentUser?.email) {
        setUsers((users) => [...users, doc.data().email]);
      }
    });
  };
  return (
    <View>
      <Text>Chat scList</Text>

      <Pressable onPress={() => signOut(auth)}>
        <Text>Sign out</Text>
      </Pressable>

      <View>
        <Pressable onPress={() => fetchUsers()}>
          <Text>New Conversation</Text>
        </Pressable>
        {users?.map((user, index) => (
          <View key={index}>
            <Pressable onPress={() => navigation.navigate("Chat", { user })}>
              <Text>{user}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ChatList;
