import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";

function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;
