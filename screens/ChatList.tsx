import { ListRenderItemInfo, Pressable } from "react-native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Box,
  HStack,
  ThreeDotsIcon,
  Text,
  Center,
  View,
  Stack,
  FlatList,
  Heading,
} from "native-base";
import HeaderModal from "../components/HeaderModal";
import { storage } from "../mmkvStorage";

const ChatList = () => {
  const [isOpen, setOpen] = useState(false);
  const [chats, setChats] = useState<any>();
  const navigation = useNavigation();

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
      setChats(uniqueChats);
      storage.set("chatList", JSON.stringify(uniqueChats));
      console.log(uniqueChats, "uniqueChats");
    } catch (e) {
      const chatlist = storage.getString("chatList");
      setChats(JSON.parse(chatlist));
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      backgroundColor={"primary"}
    >
      <HStack
        backgroundColor={"secondary"}
        padding={5}
        borderBottomRadius={10}
        justifyContent={"space-between"}
      >
        <Center>
          <Text fontWeight={600} fontSize={"xl"}>
            {auth.currentUser?.email}
          </Text>
        </Center>
        <Center>
          <Pressable onPress={() => setOpen(true)}>
            <ThreeDotsIcon />
          </Pressable>
        </Center>
      </HStack>
      <FlatList
        data={chats}
        renderItem={({ item }: any) => {
          const date = new Date(item.timestamp).toLocaleString();
          return (
            <Pressable
              onPress={() =>
                navigation.navigate("Chat", { user: item.chatWith })
              }
            >
              <HStack
                borderBottomColor={"black"}
                borderBottomWidth={1}
                justifyContent={"space-between"}
              >
                <Stack>
                  <Heading>{item.chatWith}</Heading>
                  <Text>{item.text}</Text>
                </Stack>
                <Center>
                  <Text>{date}</Text>
                </Center>
              </HStack>
            </Pressable>
          );
        }}
      />

      <HeaderModal isOpen={isOpen} setOpen={setOpen} />
    </View>
  );
};

export default ChatList;
