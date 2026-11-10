import { Product, Category } from "@/types";
import { initialProducts, initialCategories } from "@/data/initialData";
import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from "firebase/firestore";

const STORAGE_KEY_PRODUCTS = "aura_aquatics_products_v1";
const STORAGE_KEY_CATEGORIES = "aura_aquatics_categories_v1";

// In-memory fallback for SSR and dev when Firebase isn't configured
let memoryProducts: Product[] = [...initialProducts];
let memoryCategories: Category[] = [...initialCategories];

function getClientStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Local storage read error", e);
  }
  return fallback;
}

function setClientStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage save error", e);
  }
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "categories"), orderBy("displayOrder", "asc"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Category);
      }
    } catch (err) {
      console.warn("Firestore getCategories failed, falling back to local data:", err);
    }
  }

  if (typeof window !== "undefined") {
    const local = getClientStorage<Category[]>(STORAGE_KEY_CATEGORIES, memoryCategories);
    memoryCategories = local;
    return local;
  }
  return memoryCategories;
}

/**
 * Fetch all products
 */
export async function getProducts(): Promise<Product[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDocs(collection(db, "products"));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Product);
      }
    } catch (err) {
      console.warn("Firestore getProducts failed, falling back to local data:", err);
    }
  }

  if (typeof window !== "undefined") {
    const local = getClientStorage<Product[]>(STORAGE_KEY_PRODUCTS, memoryProducts);
    memoryProducts = local;
    return local;
  }
  return memoryProducts;
}

/**
 * Fetch single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "products"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as Product;
      }
    } catch (err) {
      console.warn("Firestore getProductBySlug failed, falling back:", err);
    }
  }

  const all = await getProducts();
  return all.find((p) => p.slug === slug) || null;
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const all = await getProducts();
  if (categoryId === "all") return all;
  return all.filter((p) => p.categoryId.toLowerCase() === categoryId.toLowerCase());
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.featured);
}

/**
 * Create or save new product
 */
export async function saveProduct(product: Product): Promise<Product> {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "products", product.productId), product);
      return product;
    } catch (err) {
      console.error("Firestore saveProduct error:", err);
    }
  }

  const all = await getProducts();
  const existingIdx = all.findIndex((p) => p.productId === product.productId);
  let updated: Product[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = product;
  } else {
    updated = [product, ...all];
  }
  memoryProducts = updated;
  setClientStorage(STORAGE_KEY_PRODUCTS, updated);
  return product;
}

/**
 * Delete product by ID
 */
export async function deleteProduct(productId: string): Promise<boolean> {
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, "products", productId));
      return true;
    } catch (err) {
      console.error("Firestore deleteProduct error:", err);
    }
  }

  const all = await getProducts();
  const filtered = all.filter((p) => p.productId !== productId);
  memoryProducts = filtered;
  setClientStorage(STORAGE_KEY_PRODUCTS, filtered);
  return true;
}

/**
 * Seed Firestore or local cache with the authentic initial catalogue
 */
export async function seedCatalogue(force = false): Promise<{ success: boolean; count: number }> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDocs(collection(db, "products"));
      if (snap.empty || force) {
        const batch = writeBatch(db);

        // Write categories
        for (const cat of initialCategories) {
          const catRef = doc(db, "categories", cat.categoryId);
          batch.set(catRef, cat);
        }

        // Write products
        for (const prod of initialProducts) {
          const prodRef = doc(db, "products", prod.productId);
          batch.set(prodRef, prod);
        }

        await batch.commit();
        return { success: true, count: initialProducts.length };
      }
      return { success: true, count: snap.size };
    } catch (err) {
      console.error("Firestore seed error:", err);
    }
  }

  // Local fallback
  memoryProducts = [...initialProducts];
  memoryCategories = [...initialCategories];
  setClientStorage(STORAGE_KEY_PRODUCTS, memoryProducts);
  setClientStorage(STORAGE_KEY_CATEGORIES, memoryCategories);
  return { success: true, count: initialProducts.length };
}
