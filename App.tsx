import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import SignIn from "./screens/SignIn";
import RootNav from "./navigation/RootNav";
import "./firebaseConfig";
export default function App() {
  return (
    <View style={styles.container}>
      <RootNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
