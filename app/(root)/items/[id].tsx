import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/Comment";

import { useAppwrite } from "@/lib/useAppwrite";
import { getPropertyById } from "@/lib/appwrite";

// Import the Zustand cart store functions
import { useCartStore } from "@/store/cartStore";

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const windowHeight = Dimensions.get("window").height;

  const { data: property } = useAppwrite({
    fn: getPropertyById,
    params: {
      id: id!,
    },
  });

  // Retrieve Zustand cart store functions and state
  const addItem = useCartStore((state) => state.addItem);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartItems = useCartStore((state) => state.items);

  const productId = id!; // use the id from search params as the product ID

  // Find the current product in the cart, if it exists
  const existingProduct = cartItems.find((item) => item.id === productId);
  const quantity = existingProduct ? existingProduct.quantity : 0;

  // Handle "Add to Cart" button press
  const handleAddToCart = () => {
    if (quantity === 0) {
      addItem({
        id: productId,
        name: property?.name || "",
        price: property?.price || 0,
        quantity: 1,
      });
    }
  };

  // Increase product quantity by 1
  const handleAdd = () => {
    updateItemQuantity(productId, quantity + 1);
  };

  // Decrease product quantity by 1, or remove from cart if quantity is 1
  const handleRemove = () => {
    if (quantity === 1) {
      removeItem(productId);
    } else if (quantity > 1) {
      updateItemQuantity(productId, quantity - 1);
    }
  };

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: property?.image }}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.heart}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            {property?.name}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {property?.type}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="text-black-200 text-sm mt-1 font-rubik-medium">
                {property?.rating} ({property?.reviews.length} reviews)
              </Text>
            </View>
          </View>

          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-black-300 text-xl font-rubik-bold">
              BachatGat
            </Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: property?.bachatgat.avatar }}
                  className="size-14 rounded-full"
                />

                <View className="flex flex-col items-start justify-center ml-3">
                  <Text className="text-lg text-black-300 text-start font-rubik-bold">
                    {property?.bachatgat.name}
                  </Text>
                  <Text className="text-sm text-black-200 text-start font-rubik-medium">
                    {property?.bachatgat.email}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              {property?.description}
            </Text>
          </View>

          {property?.gallery.length > 0 && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Gallery
              </Text>
              <FlatList
                contentContainerStyle={{ paddingRight: 20 }}
                data={property?.gallery}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.image }}
                    className="size-40 rounded-xl"
                  />
                )}
                contentContainerClassName="flex gap-4 mt-3"
              />
            </View>
          )}

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Location : yet to be placed
            </Text>
          </View>

          {property?.reviews.length > 0 && (
            <View className="mt-7">
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <Image source={icons.star} className="size-6" />
                  <Text className="text-black-300 text-xl font-rubik-bold ml-2">
                    {property?.rating} ({property?.reviews.length} reviews)
                  </Text>
                </View>

                <TouchableOpacity>
                  <Text className="text-primary-300 text-base font-rubik-bold">
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-5">
                <Comment item={property?.reviews[0]} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              ₹{property?.price}
            </Text>
          </View>

          {quantity > 0 ? (
            <View className="flex-1 flex flex-row items-center justify-end gap-5">
              <TouchableOpacity
                onPress={handleRemove}
                className="flex items-center  shadow-md shadow-zinc-400"
              >
                <Image source={icons.minus} className="w-6 h-6 p-5 m-1" />
              </TouchableOpacity>

              <Text className=" bg-white text-2xl font-rubik-bold">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={handleAdd}
                className="flex items-center shadow-md   shadow-zinc-400"
              >
                <Image source={icons.plus} className="w-6 h-6 p-5 m-1" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleAddToCart}
              className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
            >
              <Text className="text-white text-lg text-center font-rubik-bold">
                Add to Cart
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Property;
