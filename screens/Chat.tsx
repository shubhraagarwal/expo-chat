import { View, Text, TextInput, Pressable, Image } from "react-native";
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

  return (
    <View>
      <Text>Chat</Text>
      <Text>{route.params.user}</Text>

      <TextInput
        value={message}
        onChangeText={(e) => setMessage(e)}
        style={{ borderWidth: 1, borderColor: "black" }}
      />
      <Pressable onPress={() => sendMessage()}>
        <Text>Send</Text>
      </Pressable>
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
        <Text>Upload image</Text>
      </Pressable>
      <View>
        {chats.map((chat, index) => (
          <View key={index}>
            <Text>{chat.text}</Text>
            {chat.media && chat.media !== "" && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${chat.media}` }}
                style={{ width: 200, height: 200 }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Chat;
