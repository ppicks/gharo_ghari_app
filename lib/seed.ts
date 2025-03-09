import { ID } from "react-native-appwrite";
import { databases, config } from "./appwrite";
import {
  bachatGatImages,
  galleryImages,
  productImages,
  reviewImages,
} from "./data";

const COLLECTIONS = {
  BACHATGAT: config.bachatgatCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PRODUCTS: config.productsCollectionId,
};

const productsTypes = [
  "dryfriuts",
  "papad",
  "loanche",
  "chatni",
];



function getRandomSubset<T>(
  array: T[],
  minItems: number,
  maxItems: number
): T[] {
  if (minItems > maxItems) {
    throw new Error("minItems cannot be greater than maxItems");
  }
  if (minItems < 0 || maxItems > array.length) {
    throw new Error(
      "minItems or maxItems are out of valid range for the array"
    );
  }

  // Generate a random size for the subset within the range [minItems, maxItems]
  const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

  // Create a copy of the array to avoid modifying the original
  const arrayCopy = [...array];

  // Shuffle the array copy using Fisher-Yates algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[i],
    ];
  }

  // Return the first `subsetSize` elements of the shuffled array
  return arrayCopy.slice(0, subsetSize);
}

async function seed() {
  try {
    // Clear existing data from all collections
    for (const key in COLLECTIONS) {
      const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
      const documents = await databases.listDocuments(
        config.databaseId!,
        collectionId!
      );
      for (const doc of documents.documents) {
        await databases.deleteDocument(
          config.databaseId!,
          collectionId!,
          doc.$id
        );
      }
    }

    console.log("Cleared all existing data.");

    // Seed Agents
    const bachatgats = [];
    for (let i = 1; i <= 5; i++) {
      const bachatG = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.BACHATGAT!,
        ID.unique(),
        {
          name: `BachatGat ${i}`,
          email: `bachatGat${i}@example.com`,
          avatar: bachatGatImages[Math.floor(Math.random() * bachatGatImages.length)],
        }
      );
      bachatgats.push(bachatG);
    }
    console.log(`Seeded ${bachatgats.length} bachatgats.`);

    // Seed Reviews
    const reviews = [];
    for (let i = 1; i <= 20; i++) {
      const review = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.REVIEWS!,
        ID.unique(),
        {
          name: `Reviewer ${i}`,
          avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
          review: `This is a review by Reviewer ${i}.`,
          rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
        }
      );
      reviews.push(review);
    }
    console.log(`Seeded ${reviews.length} reviews.`);

    // Seed Galleries
    const galleries = [];
    for (const image of galleryImages) {
      const gallery = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.GALLERY!,
        ID.unique(),
        { image }
      );
      galleries.push(gallery);
    }

    console.log(`Seeded ${galleries.length} galleries.`);

    // Seed Properties
    for (let i = 1; i <= 20; i++) {
      const bachatgatId = bachatgats[Math.floor(Math.random() * bachatgats.length)];

      const  bachatgaReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
      const  bachatgaGalleries = getRandomSubset(galleries, 2, 4); // 3 to 8 galleries


      const image =
        productImages.length - 1 >= i
          ? productImages[i]
          : productImages[
              Math.floor(Math.random() * productImages.length)
            ];
      const products = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.PRODUCTS!,
        ID.unique(),
        {
          name: `Products ${i}`,
          type: productsTypes[Math.floor(Math.random() * productsTypes.length)],
          description: `This is the description for Products ${i}.`,
          price: Math.floor(Math.random() * 9000) + 1000,
          rating: Math.floor(Math.random() * 5) + 1,
          image: image,
          bachatgat: bachatgatId.$id,
          reviews: bachatgaReviews.map((review) => review.$id),
          gallery: bachatgaGalleries.map((gallery) => gallery.$id),
        }
      );

      console.log(`Seeded products: ${products.name}`);
    }

    console.log("Data seeding completed.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

export default seed;