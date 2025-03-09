import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import icons from "@/constants/icons";
import { useCartStore } from "@/store/cartStore";

interface TabIconProps {
  focused: boolean;
  icon: any;
  title: string;
  badge?: number;
}

const TabIcon = ({ focused, icon, title, badge }: TabIconProps) => (
  <View className="flex-1 mt-3 flex flex-col items-center">
    <View className="relative">
      <Image
        source={icon}
        tintColor={focused ? "#008000" : "#191D31"}
        resizeMode="contain"
        className="w-6 h-6"
      />
      {badge && badge > 0 && (
        <View className="absolute -top-1 -right-2 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
          <Text className="text-white text-[10px] font-bold">{badge}</Text>
        </View>
      )}
    </View>
    <Text
      className={`${
        focused
          ? "text-primary-300 font-rubik-medium"
          : "text-black-200 font-rubik"
      } text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  const cartItems = useCartStore((state) => state.items);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          borderTopColor: "green",
          borderTopWidth: 1,
          minHeight: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.home} focused={focused} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.search} focused={focused} title="Explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.cart}
              focused={focused}
              title="Cart"
              badge={totalQuantity}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.person} focused={focused} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
