export interface CareInformation {
  tankSize: string;
  temperament: string;
  temperature: string;
  phRange: string;
  diet: string;
  careLevel: "Beginner" | "Moderate" | "Advanced" | "Expert";
  swimmingLevel?: string;
  minimumGroupSize?: number;
}

export interface Product {
  productId: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  scientificName: string;
  originalPrice: number;
  sellingPrice: number;
  images: string[];
  availability: "in_stock" | "out_of_stock";
  waterType: "freshwater" | "saltwater";
  size: string;
  careInformation: CareInformation;
  featured: boolean;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  active: boolean;
  itemCount?: number;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  speciesPurchased?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  featured?: boolean;
}

export interface FilterState {
  categoryId: string;
  waterType: "all" | "freshwater" | "saltwater";
  availability: "all" | "in_stock" | "out_of_stock";
  searchQuery: string;
  sortBy: "price_asc" | "price_desc" | "newest" | "name_asc";
  minPrice?: number;
  maxPrice?: number;
}
