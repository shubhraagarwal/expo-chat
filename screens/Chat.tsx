import { TextInput, Pressable, Image } from "react-native";
import { useState, useEffect } from "react";
import { auth } from "../hooks/useAuth";
import * as ImagePicker from "expo-image-picker";
import {
  arrayUnion,
  doc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import useAttachmentPicker from "../hooks/useAttachmentPicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  Box,
  Input,
  Stack,
  Heading,
  HStack,
  Center,
  ChevronRightIcon,
  Icon,
  ShareIcon,
  ScrollView,
} from "native-base";
const Chat = ({ route }) => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [media, setMedia] = useState("");
  //   const attachmentPicker = useAttachmentPicker();

  const sendMessage = async () => {
    if (message.trim() === "") {
      alert("Enter a valid message");
      return;
    }

    const currentUserEmail = auth.currentUser?.email;
    const docRef1 = doc(db, "users", currentUserEmail);
    const docRef2 = doc(db, "users", route.params.user);

    const chatDataSender = {
      chatWith: route.params.user,
      text: message,
      timestamp: new Date().getTime(),
      sentBy: currentUserEmail,
      media: media,
    };
    const chatDataReceiver = {
      chatWith: currentUserEmail,
      text: message,
      timestamp: new Date().getTime(),
      sentBy: currentUserEmail,
      media: media,
    };

    await Promise.all([
      updateDoc(docRef1, {
        chats: arrayUnion(chatDataSender),
      }),
      updateDoc(docRef2, {
        chats: arrayUnion(chatDataReceiver),
      }),
    ]);

    setMessage(""); // Clear the input field after sending the message
  };

  useEffect(() => {
    const currentUserEmail = auth.currentUser?.email;
    const docRef = doc(db, "users", currentUserEmail);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      const userData = docSnap.data();
      const chatArr =
        userData?.chats?.filter(
          (chat) => chat.chatWith === route.params.user
        ) || [];
      setChats(chatArr);
    });

    return () => unsubscribe();
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
      <Stack backgroundColor={"secondary"} borderBottomRadius={10}>
        <Text>You're talking to: </Text>
        <Heading>{route.params.user}</Heading>
      </Stack>

      <ScrollView>
        <Stack space={2} mt={2}>
          {chats.map((chat, index) => {
            const date = new Date(chat.timestamp).toLocaleString();
            return (
              <View
                width={200}
                alignSelf={
                  chat.sentBy === auth.currentUser?.email
                    ? "flex-end"
                    : "flex-start"
                }
                marginX={2}
                padding={2}
                background={"white"}
                key={index}
                borderRadius={10}
              >
                {chat.media && chat.media !== "" && (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${chat.media}` }}
                    style={{ width: 150, height: 150, alignSelf: "center" }}
                    borderRadius={10}
                  />
                )}
                <Heading size="sm">{chat.text}</Heading>
                <Text>{date}</Text>
              </View>
            );
          })}
        </Stack>
      </ScrollView>
      <HStack
        marginBottom={0}
        marginTop={"auto"}
        justifyContent={"space-between"}
        backgroundColor={"secondary"}
        marginX={2}
        borderRadius={10}
        padding={2}
        space={2}
      >
        <Input
          placeholder="Enter your message"
          flex={2}
          value={message}
          onChangeText={(e) => setMessage(e)}
          InputRightElement={
            <Pressable
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
                  base64: true,
                });
                console.log("attachment", result);
                setMedia(result.assets[0].base64);
              }}
            >
              <ShareIcon mr={2} size={5} />
            </Pressable>
          }
        />
        <Pressable onPress={() => sendMessage()}>
          <Center
            height={10}
            width={10}
            background={"positive"}
            borderRadius={100}
          >
            <ChevronRightIcon />
          </Center>
        </Pressable>
      </HStack>
    </View>
  );
};

export default Chat;
