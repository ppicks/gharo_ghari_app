import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { login } from "@/lib/appwrite";
import { Redirect } from "expo-router";
import { useGlobalContext } from "@/lib/gloabl-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { loginStrings } from "@/constants/strings";

const Auth = () => {
  const { refetch, loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    const result = await login();
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            {loginStrings.title}
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            {loginStrings.heroTitleOne} {"\n"}
            <Text className="text-primary-300">
              {loginStrings.heroTitileTwo}
            </Text>
          </Text>

          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            {loginStrings.loginTitle}
          </Text>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                {loginStrings.googleLoginTitle}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
