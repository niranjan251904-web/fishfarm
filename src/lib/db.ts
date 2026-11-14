import { Product, Category, StoreSettings, CustomerOrderAudit } from "@/types";
import {
  initialProducts,
  initialCategories,
  fishCategories,
  initialStoreSettings,
  initialOrderAudits,
} from "@/data/initialData";
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

const STORAGE_KEY_PRODUCTS = "srm_fishfarm_products_v1";
const STORAGE_KEY_CATEGORIES = "srm_fishfarm_categories_v1";
const STORAGE_KEY_SETTINGS = "srm_fishfarm_settings_v1";
const STORAGE_KEY_AUDITS = "srm_fishfarm_audits_v1";

// In-memory fallback for SSR and dev when Firebase isn't configured
let memoryProducts: Product[] = [...initialProducts];
let memoryCategories: Category[] = [...initialCategories];
let memorySettings: StoreSettings = { ...initialStoreSettings };
let memoryAudits: CustomerOrderAudit[] = [...initialOrderAudits];

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
 * Fetch fish-only categories (for homepage collections carousel)
 */
export async function getFishCategories(): Promise<Category[]> {
  return fishCategories;
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

/**
 * Create or save category
 */
export async function saveCategory(category: Category): Promise<Category> {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "categories", category.categoryId), category);
      return category;
    } catch (err) {
      console.error("Firestore saveCategory error:", err);
    }
  }

  const all = await getCategories();
  const existingIdx = all.findIndex((c) => c.categoryId === category.categoryId);
  let updated: Category[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = category;
  } else {
    updated = [...all, category];
  }
  memoryCategories = updated;
  setClientStorage(STORAGE_KEY_CATEGORIES, updated);
  return category;
}

/**
 * Delete category by ID
 */
export async function deleteCategory(categoryId: string): Promise<boolean> {
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      return true;
    } catch (err) {
      console.error("Firestore deleteCategory error:", err);
    }
  }

  const all = await getCategories();
  const filtered = all.filter((c) => c.categoryId !== categoryId);
  memoryCategories = filtered;
  setClientStorage(STORAGE_KEY_CATEGORIES, filtered);
  return true;
}

/**
 * Get store settings (top banner, hero, posters, contact)
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDocs(collection(db, "settings"));
      if (!snap.empty) {
        return snap.docs[0].data() as StoreSettings;
      }
    } catch (err) {
      console.warn("Firestore getStoreSettings failed, falling back:", err);
    }
  }

  if (typeof window !== "undefined") {
    const local = getClientStorage<StoreSettings>(STORAGE_KEY_SETTINGS, memorySettings);
    memorySettings = local;
    return local;
  }
  return memorySettings;
}

/**
 * Save store settings
 */
export async function saveStoreSettings(settings: StoreSettings): Promise<StoreSettings> {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "settings", "global_store_settings"), settings);
      return settings;
    } catch (err) {
      console.error("Firestore saveStoreSettings error:", err);
    }
  }

  memorySettings = { ...settings };
  setClientStorage(STORAGE_KEY_SETTINGS, settings);
  return settings;
}

/**
 * Get customer order audits
 */
export async function getOrderAudits(): Promise<CustomerOrderAudit[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "order_audits"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as CustomerOrderAudit);
      }
    } catch (err) {
      console.warn("Firestore getOrderAudits failed, falling back:", err);
    }
  }

  if (typeof window !== "undefined") {
    const local = getClientStorage<CustomerOrderAudit[]>(STORAGE_KEY_AUDITS, memoryAudits);
    memoryAudits = local;
    return local;
  }
  return memoryAudits;
}

/**
 * Save/log a customer order audit
 */
export async function saveOrderAudit(order: CustomerOrderAudit): Promise<CustomerOrderAudit> {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "order_audits", order.id), order);
      return order;
    } catch (err) {
      console.error("Firestore saveOrderAudit error:", err);
    }
  }

  const all = await getOrderAudits();
  const existingIdx = all.findIndex((o) => o.id === order.id);
  let updated: CustomerOrderAudit[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = order;
  } else {
    updated = [order, ...all];
  }
  memoryAudits = updated;
  setClientStorage(STORAGE_KEY_AUDITS, updated);
  return order;
}

/**
 * Update order audit status
 */
export async function updateOrderStatus(
  orderId: string,
  status: CustomerOrderAudit["status"]
): Promise<boolean> {
  const all = await getOrderAudits();
  const target = all.find((o) => o.id === orderId);
  if (!target) return false;
  target.status = status;
  await saveOrderAudit(target);
  return true;
}

/**
 * Delete order audit by ID
 */
export async function deleteOrderAudit(orderId: string): Promise<boolean> {
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, "order_audits", orderId));
      return true;
    } catch (err) {
      console.error("Firestore deleteOrderAudit error:", err);
    }
  }

  const all = await getOrderAudits();
  const filtered = all.filter((o) => o.id !== orderId);
  memoryAudits = filtered;
  setClientStorage(STORAGE_KEY_AUDITS, filtered);
  return true;
}
