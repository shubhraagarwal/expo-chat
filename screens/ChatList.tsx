import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../hooks/useAuth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
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
  const fetchChatList = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", auth.currentUser?.email)
      );
      let chatList = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc, "q");
        chatList = doc.data().chats.reverse();
      });
      //   console.log(chatList, "chatList");
      const uniqueChats = [];
      const chatMap = new Map();

      for (const chat of chatList) {
        const chatWith = chat.chatWith;
        if (!chatMap.has(chatWith)) {
          chatMap.set(chatWith, chat);
          uniqueChats.push(chat);
        }
      }
      console.log(uniqueChats, "uniqueChats");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);
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
