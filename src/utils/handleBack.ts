// src/utils/navigation.ts
import { router } from "expo-router";

export const handleBack = (fallbackPath: string = "/home") => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallbackPath as any);
  }
};
