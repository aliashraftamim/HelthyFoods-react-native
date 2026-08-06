// app/_layout.tsx
import { persistor, store } from "@/src/redux/store";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </PersistGate>
    </Provider>
  );
}
