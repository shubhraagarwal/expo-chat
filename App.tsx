import RootNav from "./navigation/RootNav";
import "./firebaseConfig";
import { NativeBaseProvider, extendTheme } from "native-base";

export default function App() {
  const theme = extendTheme({
    colors: {
      primary: "#91C8FF",

      secondary: "#EBFEAF",
      positive: "#62D8B2",
      negative: "#F98070",
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <RootNav />
    </NativeBaseProvider>
  );
}
