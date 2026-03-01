import { useAppSelector } from "@/src/redux/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const { token, user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");

      if (!hasLaunched) {
        // ✅ First time
        setIsFirstLaunch(true);
        await AsyncStorage.setItem("hasLaunched", "true");
      }

      // 5 sec splash
      setTimeout(() => setIsLoading(false), 5000);
    };

    checkFirstLaunch();
  }, []);

  // // Splash চলছে
  // if (isLoading) {
  //   return <SplashScreen />;
  // }

  // // First time install → Welcome
  // if (isFirstLaunch) {
  //   return <Redirect href="/welcome" />;
  // }

  // Already installed
  if (token && user) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/signin" />;
}
