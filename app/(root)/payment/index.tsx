// PaymentComponent.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import { router } from "expo-router";
import icons from "@/constants/icons";
import { useCartStore } from "@/store/cartStore";

const PaymentComponent = () => {
  const clearCart = useCartStore((state) => state.clearCart);

  // Default payment method is Cash on Delivery (cod)
  const [paymentMethod, setPaymentMethod] = useState("cod");
  // Flag to indicate if the order has been placed
  const [orderPlaced, setOrderPlaced] = useState(false);
  // Loading state for simulating payment processing
  const [loading, setLoading] = useState(false);

  const handleSelectPaymentMethod = (method: string) => {
    // Card and UPI are disabled for now.
    if (method === "card" || method === "upi") {
      Alert.alert("Unavailable", "This payment option is disabled for now.");
      return;
    }
    setPaymentMethod(method);
  };

  const handlePayNow = () => {
    // Since only Cash on Delivery is active, we proceed with that.
    if (paymentMethod !== "cod") {
      Alert.alert("Unavailable", "Please select Cash on Delivery.");
      return;
    }
    setLoading(true);
    // Simulate payment processing and order placement
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
      clearCart();
      // After 3 seconds, redirect to the Orders component
      setTimeout(() => {
        router.push("/"); // Ensure the '/orders' route is defined
      }, 3000);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <SafeAreaView className="h-full">
        <View className="flex-1 items-center justify-center bg-white p-4">
          <Image source={icons.orderPlaced} className="size-60" />
          <Text className="text-2xl font-bold text-green-600 mb-6">
            Order placed successfully!
          </Text>
          <TouchableOpacity
            onPress={() => router.push(`/`)}
            className="flex-row items-center justify-center border-green-700 border rounded-md h-10 w-3/4"
          >
            <Text className="text-black-300 text-lg font-bold">My Orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full">
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Image source={icons.payment} className="size-60" />
        <Text className="text-2xl font-bold mb-6">Payment Options</Text>
        <View className="w-full mb-6">
          {/* Card Payment (Disabled) */}
          <TouchableOpacity
            onPress={() => handleSelectPaymentMethod("card")}
            className="p-4 border border-gray-300 rounded mb-2 opacity-50"
            disabled
          >
            <Text className="text-lg text-center">Card Payment (Disabled)</Text>
          </TouchableOpacity>
          {/* UPI Payment (Disabled) */}
          <TouchableOpacity
            onPress={() => handleSelectPaymentMethod("upi")}
            className="p-4 border border-gray-300 rounded mb-2 opacity-50"
            disabled
          >
            <Text className="text-lg text-center">UPI Payment (Disabled)</Text>
          </TouchableOpacity>
          {/* Cash on Delivery (Active) */}
          <TouchableOpacity
            onPress={() => handleSelectPaymentMethod("cod")}
            className={`p-4 border border-gray-300 rounded mb-2 ${
              paymentMethod === "cod" ? "bg-primary-100" : ""
            }`}
          >
            <Text className="text-lg text-center">Cash on Delivery</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handlePayNow}
          disabled={loading}
          className="flex-row items-center justify-center bg-primary-300 py-3 rounded-md shadow-md shadow-zinc-400 w-3/4 mb-4"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold">Pay Now</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/`)}
          className="flex-row items-center justify-center border-green-700 border rounded-md h-10 w-3/4"
        >
          <Text className="text-black-300 text-lg font-bold">Shop More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentComponent;
