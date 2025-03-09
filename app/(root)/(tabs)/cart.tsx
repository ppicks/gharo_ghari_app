// CartPage.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { CartItem, useCartStore } from "@/store/cartStore";
import icons from "@/constants/icons";

const CartPage = () => {
  // Retrieve cart state and functions from Zustand
  const cartItems = useCartStore((state) => state.items);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalPrice = cartItems.reduce(
    (total, item: CartItem) => total + item.price * item.quantity,
    0
  );
  // Render each cart item with plus and minus buttons
  const renderCartItem = ({
    item,
  }: {
    item: { id: string; name: string; price: number; quantity: number };
  }) => {
    return (
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <View className="flex-1">
          <Text className="text-lg font-bold">{item.name}</Text>
          <Text className="text-sm text-gray-600">Price: ₹{item.price}</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              if (item.quantity > 1) {
                updateItemQuantity(item.id, item.quantity - 1);
              } else {
                // Remove the item if quantity reaches 1
                removeItem(item.id);
              }
            }}
          >
            <Image source={icons.minus} className="w-6 h-6 p-4 m-1" />
          </TouchableOpacity>
          <Text className="px-4 text-lg font-bold">{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
          >
            <Image source={icons.plus} className="w-6 h-6 p-4 m-1" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="flex-1 bg-white p-4">
        <Text className="text-2xl font-bold mb-4 text-primary-300">
          Your Cart
        </Text>
        {cartItems.length === 0 ? (
          <View className="flex flex-1 justify-center items-center">
            <Image source={icons.emptyCart} className="size-60" />
            <Text className="text-primary-300 text-3xl mt-3">
              Your cart is empty
            </Text>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      {cartItems.length > 0 && (
        <View className="mt-4 border-t border-green-800 pt-4 mb-24 mr-4 ml-4">
          <View className="mb-2 ">
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-2xl">Total:</Text>
              <Text className="text-2xl font-bold">₹{totalPrice}</Text>
            </View>
          </View>

          {/* Checkout Button */}

          <View className="bg-white h-14">
            <TouchableOpacity
              onPress={() => router.push(`/payment`)}
              className="flex-1 flex-row items-center justify-center bg-primary-300 rounded-md shadow-md shadow-zinc-400"
            >
              <Text className="text-white text-2xl font-bold">
                Place your order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartPage;
