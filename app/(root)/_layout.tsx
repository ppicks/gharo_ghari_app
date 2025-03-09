import { useGlobalContext } from "@/lib/gloabl-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, SafeAreaView } from "react-native";

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flx justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }
  if (!isLogged) return <Redirect href="/sign-in" />;

  return <Slot />;
}
