import React, { useState } from "react";
import {
  FormControl,
  Input,
  Text,
  Modal,
  Stack,
  Center,
  Pressable,
  View,
} from "native-base";
import { signOut } from "firebase/auth";
import { auth } from "../hooks/useAuth";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

const HeaderModal = ({ isOpen, setOpen }: Props) => {
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
    <Modal isOpen={isOpen} onClose={() => setOpen(false)} safeAreaTop={true}>
      <Modal.Content
        width="full"
        height="400"
        marginBottom={0}
        marginTop={"auto"}
      >
        <Modal.CloseButton />
        <Modal.Header>Options</Modal.Header>
        <Modal.Body>
          <Stack space={5}>
            <Center
              borderWidth={1}
              borderColor={"black"}
              borderRadius={10}
              padding={2}
              backgroundColor={"positive"}
            >
              <Pressable onPress={() => fetchUsers()}>
                <Text color={"white"}>New Conversation</Text>
              </Pressable>
            </Center>
            {users?.map((user, index) => {
              return (
                <View
                  padding={2}
                  backgroundColor={"#99E1FE"}
                  borderRadius={10}
                  borderColor={"black"}
                  borderWidth={1}
                  key={index}
                >
                  <Pressable
                    onPress={() => navigation.navigate("Chat", { user })}
                  >
                    <Text>{user}</Text>
                  </Pressable>
                </View>
              );
            })}
            <Center
              borderWidth={1}
              borderColor={"black"}
              borderRadius={10}
              padding={2}
            >
              <Pressable onPress={() => signOut(auth)}>
                <Text color={"negative"}>Sign Out</Text>
              </Pressable>
            </Center>
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default HeaderModal;
