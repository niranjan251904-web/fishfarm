"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Layers,
  Tag,
  ClipboardList,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  LogOut,
  Search,
  ExternalLink,
  Save,
  X,
  Eye,
  MessageCircle,
  Filter,
  Phone,
  MapPin,
  Calendar,
  Check,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  Product,
  Category,
  StoreSettings,
  PromoPoster,
  CustomerOrderAudit,
} from "@/types";
import {
  getProducts,
  getCategories,
  saveProduct,
  deleteProduct,
  saveCategory,
  deleteCategory,
  getStoreSettings,
  saveStoreSettings,
  getOrderAudits,
  saveOrderAudit,
  updateOrderStatus,
  deleteOrderAudit,
  seedCatalogue,
} from "@/lib/db";
import { isFirebaseConfigured, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { formatCurrency } from "@/config/site";

type AdminTab = "products" | "collections" | "offers" | "audits" | "store";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  // State data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [orderAudits, setOrderAudits] = useState<CustomerOrderAudit[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Filter & Search states
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [auditStatusFilter, setAuditStatusFilter] = useState("all");

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({});

  // Collection Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({});

  // Poster Modal State
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState<PromoPoster | null>(null);
  const [posterFormData, setPosterFormData] = useState<Partial<PromoPoster>>({});

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("hs_admin_logged_in");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      loadAllAdminData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [p, c, s, a] = await Promise.all([
        getProducts(),
        getCategories(),
        getStoreSettings(),
        getOrderAudits(),
      ]);
      setProducts(p);
      setCategories(c);
      setStoreSettings(s);
      setOrderAudits(a);
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (isFirebaseConfigured() && auth) {
      try {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        setIsAuthenticated(true);
        sessionStorage.setItem("hs_admin_logged_in", "true");
        loadAllAdminData();
        return;
      } catch (err: unknown) {
        console.warn("Firebase Auth error, checking fallback admin credentials:", err);
      }
    }

    // Default credentials for local/sandbox demo
    const validEmails = ["admin@hsaquatics.in", "admin@aura-aquatics.in", "admin"];
    if (validEmails.includes(adminEmail.trim()) && adminPassword === "Aquarium2026!") {
      setIsAuthenticated(true);
      sessionStorage.setItem("hs_admin_logged_in", "true");
      loadAllAdminData();
    } else {
      setAuthError("Invalid credentials. Try: admin@hsaquatics.in / Aquarium2026!");
    }
  };

  const handleLogout = () => {
    if (isFirebaseConfigured() && auth) {
      signOut(auth).catch(() => {});
    }
    sessionStorage.removeItem("hs_admin_logged_in");
    setIsAuthenticated(false);
  };

  // -------------------------------------------------------------
  // PRODUCTS HANDLERS
  // -------------------------------------------------------------
  const handleToggleStock = async (product: Product) => {
    const newStatus = product.availability === "in_stock" ? "out_of_stock" : "in_stock";
    const updated: Product = {
      ...product,
      availability: newStatus,
      updatedAt: new Date().toISOString(),
    };
    await saveProduct(updated);
    setProducts((prev) => prev.map((p) => (p.productId === product.productId ? updated : p)));
    notify(`${product.name} marked as ${newStatus === "in_stock" ? "In Stock" : "Out of Stock"}`);
  };

  const handleToggleFeatured = async (product: Product) => {
    const updated: Product = {
      ...product,
      featured: !product.featured,
      updatedAt: new Date().toISOString(),
    };
    await saveProduct(updated);
    setProducts((prev) => prev.map((p) => (p.productId === product.productId ? updated : p)));
    notify(`${product.name} featured status toggled`);
  };

  const handleQuickPriceChange = async (product: Product, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) return;
    const updated: Product = {
      ...product,
      sellingPrice: newPrice,
      updatedAt: new Date().toISOString(),
    };
    await saveProduct(updated);
    setProducts((prev) => prev.map((p) => (p.productId === product.productId ? updated : p)));
    notify(`Price updated for ${product.name} to ₹${newPrice}`);
  };

  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!window.confirm(`Delete ${name} permanently from the catalogue?`)) return;
    await deleteProduct(productId);
    setProducts((prev) => prev.filter((p) => p.productId !== productId));
    notify(`${name} removed from catalogue.`);
  };

  const handleOpenProductCreate = () => {
    setEditingProduct(null);
    setProductFormData({
      name: "",
      slug: "",
      categoryId: categories[1]?.slug || "angelfish",
      categoryName: categories[1]?.name || "Angelfish",
      scientificName: "",
      originalPrice: 250,
      sellingPrice: 190,
      availability: "in_stock",
      waterType: "freshwater",
      size: '1.5" - 2.0"',
      images: ["/images/fish/angels-altum-angel.webp"],
      description: "Quarantined ornamental freshwater species. Conditioned for 14 days.",
      featured: false,
      careInformation: {
        tankSize: "30+ Gallons",
        temperature: "24°C - 28°C",
        phRange: "6.5 - 7.5",
        temperament: "Peaceful",
        diet: "Omnivore / Micro-pellets",
        careLevel: "Beginner",
      },
    });
    setIsProductModalOpen(true);
  };

  const handleOpenProductEdit = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({ ...product });
    setIsProductModalOpen(true);
  };

  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryObj = categories.find((c) => c.slug === productFormData.categoryId);
    const categoryName = categoryObj ? categoryObj.name : "Ornamental Fish";

    const productToSave: Product = {
      productId: editingProduct ? editingProduct.productId : `prod-${Date.now()}`,
      name: productFormData.name || "Unnamed Fish",
      slug:
        productFormData.slug ||
        (productFormData.name || "fish").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId: productFormData.categoryId || "angelfish",
      categoryName,
      scientificName: productFormData.scientificName || "",
      originalPrice: Number(productFormData.originalPrice) || 0,
      sellingPrice: Number(productFormData.sellingPrice) || 0,
      availability: productFormData.availability || "in_stock",
      waterType: productFormData.waterType || "freshwater",
      size: productFormData.size || '2.0"',
      images:
        productFormData.images && productFormData.images.length > 0
          ? productFormData.images
          : ["/images/fish/angels-altum-angel.webp"],
      description: productFormData.description || "",
      featured: !!productFormData.featured,
      badge: productFormData.badge,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      careInformation: {
        tankSize: productFormData.careInformation?.tankSize || "30+ Gallons",
        temperature: productFormData.careInformation?.temperature || "24°C - 28°C",
        phRange: productFormData.careInformation?.phRange || "6.5 - 7.5",
        temperament: productFormData.careInformation?.temperament || "Peaceful",
        diet: productFormData.careInformation?.diet || "Omnivore",
        careLevel: productFormData.careInformation?.careLevel || "Beginner",
      },
    };

    await saveProduct(productToSave);
    setIsProductModalOpen(false);
    await loadAllAdminData();
    notify(`Saved ${productToSave.name} successfully.`);
  };

  // -------------------------------------------------------------
  // COLLECTIONS & HERO HANDLERS
  // -------------------------------------------------------------
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings) return;
    await saveStoreSettings(storeSettings);
    notify("Hero Section updated and published live!");
  };

  const handleOpenCategoryCreate = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      slug: "",
      description: "Collection of ornamental species.",
      image: "/images/fish/angels-altum-angel.webp",
      displayOrder: categories.length + 1,
      active: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenCategoryEdit = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFormData({ ...cat });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategoryModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const catToSave: Category = {
      categoryId: editingCategory ? editingCategory.categoryId : (categoryFormData.slug || `cat-${Date.now()}`),
      name: categoryFormData.name || "New Collection",
      slug:
        categoryFormData.slug ||
        (categoryFormData.name || "collection").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: categoryFormData.description || "",
      image: categoryFormData.image || "/images/fish/angels-altum-angel.webp",
      displayOrder: Number(categoryFormData.displayOrder) || categories.length + 1,
      active: categoryFormData.active !== undefined ? categoryFormData.active : true,
    };

    await saveCategory(catToSave);
    setIsCategoryModalOpen(false);
    await loadAllAdminData();
    notify(`Saved collection "${catToSave.name}".`);
  };

  const handleDeleteCategory = async (categoryId: string, name: string) => {
    if (!window.confirm(`Delete collection "${name}"? Existing products in this category will remain.`)) return;
    await deleteCategory(categoryId);
    setCategories((prev) => prev.filter((c) => c.categoryId !== categoryId));
    notify(`Deleted collection "${name}".`);
  };

  // -------------------------------------------------------------
  // OFFERS, BANNERS & POSTERS HANDLERS
  // -------------------------------------------------------------
  const handleSaveTopBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings) return;
    await saveStoreSettings(storeSettings);
    notify("Announcement Top Banner updated and published!");
  };

  const handleOpenPosterCreate = () => {
    setEditingPoster(null);
    setPosterFormData({
      title: "",
      subtitle: "",
      tag: "SPECIAL OFFER",
      imageUrl: "/images/fish/angels-altum-angel.webp",
      link: "/fish",
      buttonText: "Shop Collection",
      active: true,
      displayOrder: (storeSettings?.posters?.length || 0) + 1,
    });
    setIsPosterModalOpen(true);
  };

  const handleOpenPosterEdit = (poster: PromoPoster) => {
    setEditingPoster(poster);
    setPosterFormData({ ...poster });
    setIsPosterModalOpen(true);
  };

  const handleSavePosterModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings) return;

    const posterToSave: PromoPoster = {
      id: editingPoster ? editingPoster.id : `poster-${Date.now()}`,
      title: posterFormData.title || "Special Offer",
      subtitle: posterFormData.subtitle || "",
      tag: posterFormData.tag || "OFFER",
      imageUrl: posterFormData.imageUrl || "/images/fish/angels-altum-angel.webp",
      link: posterFormData.link || "/fish",
      buttonText: posterFormData.buttonText || "View Collection",
      active: posterFormData.active !== undefined ? posterFormData.active : true,
      displayOrder: Number(posterFormData.displayOrder) || 1,
    };

    let updatedPosters: PromoPoster[];
    const exists = storeSettings.posters.findIndex((p) => p.id === posterToSave.id);
    if (exists >= 0) {
      updatedPosters = [...storeSettings.posters];
      updatedPosters[exists] = posterToSave;
    } else {
      updatedPosters = [...storeSettings.posters, posterToSave];
    }

    const updatedSettings: StoreSettings = {
      ...storeSettings,
      posters: updatedPosters,
    };

    setStoreSettings(updatedSettings);
    await saveStoreSettings(updatedSettings);
    setIsPosterModalOpen(false);
    notify("Special Offer Poster saved successfully.");
  };

  const handleDeletePoster = async (posterId: string) => {
    if (!storeSettings) return;
    if (!window.confirm("Delete this promotional poster card?")) return;
    const updatedPosters = storeSettings.posters.filter((p) => p.id !== posterId);
    const updatedSettings = { ...storeSettings, posters: updatedPosters };
    setStoreSettings(updatedSettings);
    await saveStoreSettings(updatedSettings);
    notify("Poster removed.");
  };

  const handleTogglePosterActive = async (poster: PromoPoster) => {
    if (!storeSettings) return;
    const updatedPosters = storeSettings.posters.map((p) =>
      p.id === poster.id ? { ...p, active: !p.active } : p
    );
    const updatedSettings = { ...storeSettings, posters: updatedPosters };
    setStoreSettings(updatedSettings);
    await saveStoreSettings(updatedSettings);
    notify(`Poster status toggled.`);
  };

  // -------------------------------------------------------------
  // AUDIT & INQUIRY STATUS HANDLERS
  // -------------------------------------------------------------
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: CustomerOrderAudit["status"]
  ) => {
    await updateOrderStatus(orderId, status);
    setOrderAudits((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    notify(`Order #${orderId} status set to "${status}"`);
  };

  const handleDeleteAudit = async (orderId: string) => {
    if (!window.confirm("Delete this order record from the audit log?")) return;
    await deleteOrderAudit(orderId);
    setOrderAudits((prev) => prev.filter((o) => o.id !== orderId));
    notify("Order record deleted.");
  };

  // -------------------------------------------------------------
  // STORE SETTINGS HANDLER
  // -------------------------------------------------------------
  const handleSaveStoreGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings) return;
    await saveStoreSettings(storeSettings);
    notify("Store details and WhatsApp desk settings updated!");
  };

  const handleResetToDefaults = async () => {
    if (!window.confirm("Reset the entire catalogue to original initial specimens?")) return;
    setLoading(true);
    await seedCatalogue(true);
    await loadAllAdminData();
    notify("Catalogue reset to authentic initial stock.");
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white border border-[#E2E8F0] p-8 sm:p-10 rounded-sm shadow-xs">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-full bg-blue-50 text-[#0055FF] mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#020617]">
              Administrative Console
            </h2>
            <p className="mt-2 text-xs text-[#64748B]">
              Sign in to manage catalogue, hero visual, collections, offers, and WhatsApp audits.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Admin Email
              </label>
              <input
                type="text"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@hsaquatics.in"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] text-sm text-[#020617] focus:outline-none focus:border-[#0055FF] rounded-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] text-sm text-[#020617] focus:outline-none focus:border-[#0055FF] rounded-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-[#0055FF] hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-widest rounded-xs transition-colors shadow-xs"
            >
              Sign In to Management
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
            <span className="text-[11px] text-[#64748B] block">
              Default Sandbox Credentials:
            </span>
            <code className="text-[11px] text-[#020617] font-mono mt-1 block">
              admin@hsaquatics.in / Aquarium2026!
            </code>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.scientificName?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.productId.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat =
      productCategoryFilter === "all" || p.categoryId === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Audits
  const filteredAudits = orderAudits.filter((a) => {
    if (auditStatusFilter === "all") return true;
    return a.status === auditStatusFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#020617]">
      {/* Top Notification Toast */}
      {feedbackMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#020617] text-white text-xs font-medium px-4 py-3 rounded-xs shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Admin Navigation Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-sm sm:text-base tracking-widest uppercase text-[#020617]">
                HS Aquatics
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-[#0055FF] rounded-xs border border-blue-200">
                Master Control
              </span>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0055FF] font-medium transition-colors"
              >
                <span>Live Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto border-t border-[#E2E8F0] py-2 scrollbar-none">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs whitespace-nowrap transition-colors ${
                activeTab === "products"
                  ? "bg-[#0055FF] text-white"
                  : "text-[#64748B] hover:text-[#020617] hover:bg-slate-100"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products & Stock</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === "products" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("collections")}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs whitespace-nowrap transition-colors ${
                activeTab === "collections"
                  ? "bg-[#0055FF] text-white"
                  : "text-[#64748B] hover:text-[#020617] hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Collections & Hero</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === "collections" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("offers")}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs whitespace-nowrap transition-colors ${
                activeTab === "offers"
                  ? "bg-[#0055FF] text-white"
                  : "text-[#64748B] hover:text-[#020617] hover:bg-slate-100"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Offers, Banners & Posters</span>
              {storeSettings?.topBanner?.enabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("audits")}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs whitespace-nowrap transition-colors ${
                activeTab === "audits"
                  ? "bg-[#0055FF] text-white"
                  : "text-[#64748B] hover:text-[#020617] hover:bg-slate-100"
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Order & Inquiry Audits</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === "audits" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                {orderAudits.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("store")}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs whitespace-nowrap transition-colors ${
                activeTab === "store"
                  ? "bg-[#0055FF] text-white"
                  : "text-[#64748B] hover:text-[#020617] hover:bg-slate-100"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Store & WhatsApp Desk</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================= */}
        {/* TAB 1: PRODUCTS & INVENTORY */}
        {/* ========================================================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 border border-[#E2E8F0] rounded-xs shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                  Total Specimens
                </span>
                <span className="text-2xl font-bold text-[#020617] mt-1 block">
                  {products.length}
                </span>
              </div>
              <div className="bg-white p-4 border border-[#E2E8F0] rounded-xs shadow-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">
                  Available in Stock
                </span>
                <span className="text-2xl font-bold text-emerald-600 mt-1 block">
                  {products.filter((p) => p.availability === "in_stock").length}
                </span>
              </div>
              <div className="bg-white p-4 border border-[#E2E8F0] rounded-xs shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Out of Stock
                </span>
                <span className="text-2xl font-bold text-slate-700 mt-1 block">
                  {products.filter((p) => p.availability === "out_of_stock").length}
                </span>
              </div>
              <div className="bg-white p-4 border border-[#E2E8F0] rounded-xs shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#0055FF] tracking-wider block">
                  Featured Strains
                </span>
                <span className="text-2xl font-bold text-[#0055FF] mt-1 block">
                  {products.filter((p) => p.featured).length}
                </span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xs shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="flex flex-1 flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by fish name or scientific taxon..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenProductCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0055FF] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Specimen</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xs shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      <th className="py-3 px-4">Specimen</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Selling Price (INR)</th>
                      <th className="py-3 px-4">Original Price</th>
                      <th className="py-3 px-4 text-center">Stock Status</th>
                      <th className="py-3 px-4 text-center">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-xs">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#64748B]">
                          No specimens found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.productId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0] || "/images/fish/angels-altum-angel.webp"}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded-xs border border-[#E2E8F0]"
                              />
                              <div>
                                <span className="font-bold text-[#020617] block">
                                  {p.name}
                                </span>
                                <span className="text-[11px] text-[#64748B] italic block">
                                  {p.scientificName || "Ornamental"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-xs">
                              {p.categoryName || p.categoryId}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 max-w-[120px]">
                              <span className="text-slate-400 font-semibold">₹</span>
                              <input
                                type="number"
                                defaultValue={p.sellingPrice}
                                onBlur={(e) =>
                                  handleQuickPriceChange(p, Number(e.target.value))
                                }
                                className="w-20 px-2 py-1 text-xs font-bold bg-white border border-[#E2E8F0] rounded-xs focus:outline-none focus:border-[#0055FF]"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#64748B] line-through">
                            ₹{p.originalPrice}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`px-3 py-1 rounded-xs text-[10px] font-bold tracking-wider uppercase transition-colors ${
                                p.availability === "in_stock"
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                              }`}
                            >
                              {p.availability === "in_stock" ? "In Stock" : "Out of Stock"}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`p-1.5 rounded-xs transition-colors ${
                                p.featured
                                  ? "text-[#0055FF] bg-blue-50"
                                  : "text-slate-300 hover:text-slate-400"
                              }`}
                              title={p.featured ? "Featured on Home" : "Not Featured"}
                            >
                              <TrendingUp className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleOpenProductEdit(p)}
                                className="p-1.5 text-slate-600 hover:text-[#0055FF] hover:bg-blue-50 rounded-xs transition-colors"
                                title="Edit Specimen"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.productId, p.name)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COLLECTIONS & HERO MANAGER */}
        {/* ========================================================= */}
        {activeTab === "collections" && (
          <div className="space-y-8">
            {/* Hero Section Live Editor */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xs shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#020617]">
                    Homepage Hero Visual & Copy
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Modify the video background, bold headline, and primary call-to-action button.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-blue-50 text-[#0055FF] rounded-xs border border-blue-200">
                  Live on Storefront
                </span>
              </div>

              {storeSettings && (
                <form onSubmit={handleSaveHero} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Hero Main Headline (Use enter for new line)
                      </label>
                      <textarea
                        rows={3}
                        value={storeSettings.hero.title}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            hero: { ...storeSettings.hero, title: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF] font-sans"
                        placeholder="Curated&#10;Aquatic Standard"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={storeSettings.hero.buttonText}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              hero: { ...storeSettings.hero, buttonText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                          CTA Button Destination Link
                        </label>
                        <input
                          type="text"
                          value={storeSettings.hero.buttonLink}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              hero: { ...storeSettings.hero, buttonLink: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Background Video URL (MP4)
                      </label>
                      <input
                        type="text"
                        value={storeSettings.hero.videoUrl}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            hero: { ...storeSettings.hero, videoUrl: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                        placeholder="/videos/hero-aquarium.mp4"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Fallback / Poster Image URL
                      </label>
                      <input
                        type="text"
                        value={storeSettings.hero.posterImage}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            hero: { ...storeSettings.hero, posterImage: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                        placeholder="/images/fish/angels-altum-angel.webp"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0055FF] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Publish Hero</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Homepage Collections Manager */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xs shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#020617]">
                    Homepage Collections (Auto-Scrolling Showcase)
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Manage categories displayed in the 60fps marquee strip and category filters.
                  </p>
                </div>
                <button
                  onClick={handleOpenCategoryCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0055FF] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Collection</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.categoryId}
                    className="border border-[#E2E8F0] rounded-xs overflow-hidden bg-slate-50 flex flex-col justify-between group hover:border-[#0055FF] transition-all"
                  >
                    <div className="relative h-36 w-full bg-slate-200">
                      <img
                        src={cat.image || "/images/fish/angels-altum-angel.webp"}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-xs">
                        Order #{cat.displayOrder}
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-xs ${
                            cat.active
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-500 text-white"
                          }`}
                        >
                          {cat.active ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-[#020617]">{cat.name}</h4>
                        <span className="text-[10px] text-[#64748B] block mt-0.5">
                          Slug: /{cat.slug}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-[#E2E8F0]">
                        <button
                          onClick={() => handleOpenCategoryEdit(cat)}
                          className="p-1.5 text-slate-600 hover:text-[#0055FF] hover:bg-blue-50 rounded-xs"
                          title="Edit Collection"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        {cat.slug !== "all" && (
                          <button
                            onClick={() => handleDeleteCategory(cat.categoryId, cat.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xs"
                            title="Delete Collection"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: OFFERS, BANNERS & POSTERS */}
        {/* ========================================================= */}
        {activeTab === "offers" && (
          <div className="space-y-8">
            {/* Top Announcement Bar Manager */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xs shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#020617]">
                    Top Announcement Bar (Site-wide Banner)
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Enable or disable the prominent top notification bar, customize message, colors, and links.
                  </p>
                </div>
                {storeSettings?.topBanner?.enabled ? (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 rounded-xs border border-emerald-200">
                    Banner Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 rounded-xs">
                    Banner Off
                  </span>
                )}
              </div>

              {storeSettings && (
                <form onSubmit={handleSaveTopBanner} className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-[#E2E8F0] rounded-xs">
                    <input
                      type="checkbox"
                      id="bannerEnabled"
                      checked={storeSettings.topBanner.enabled}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          topBanner: {
                            ...storeSettings.topBanner,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-[#0055FF] rounded-xs"
                    />
                    <label htmlFor="bannerEnabled" className="text-xs font-semibold text-[#020617] cursor-pointer">
                      Enable Top Announcement Bar on All Pages
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Banner Message Copy
                    </label>
                    <input
                      type="text"
                      value={storeSettings.topBanner.text}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          topBanner: { ...storeSettings.topBanner, text: e.target.value },
                        })
                      }
                      placeholder="SPECIAL OFFER: FREE OXYGEN PACKAGING ON ORDERS ABOVE INR 1,500"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Link URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={storeSettings.topBanner.link || ""}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            topBanner: { ...storeSettings.topBanner, link: e.target.value },
                          })
                        }
                        placeholder="/fish"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={storeSettings.topBanner.bgColor || "#0055FF"}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              topBanner: { ...storeSettings.topBanner, bgColor: e.target.value },
                            })
                          }
                          className="w-8 h-8 rounded-xs cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={storeSettings.topBanner.bgColor || "#0055FF"}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              topBanner: { ...storeSettings.topBanner, bgColor: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-[#E2E8F0] rounded-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={storeSettings.topBanner.textColor || "#FFFFFF"}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              topBanner: { ...storeSettings.topBanner, textColor: e.target.value },
                            })
                          }
                          className="w-8 h-8 rounded-xs cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={storeSettings.topBanner.textColor || "#FFFFFF"}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              topBanner: { ...storeSettings.topBanner, textColor: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-[#E2E8F0] rounded-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Preview Strip */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                      Live Strip Preview:
                    </span>
                    <div
                      style={{
                        backgroundColor: storeSettings.topBanner.bgColor || "#0055FF",
                        color: storeSettings.topBanner.textColor || "#FFFFFF",
                      }}
                      className="py-2 px-4 text-xs font-semibold tracking-wider uppercase text-center rounded-xs shadow-xs"
                    >
                      {storeSettings.topBanner.text || "Your announcement message"}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0055FF] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Announcement Bar</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Special Offer Posters & Banners Manager */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xs shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#020617]">
                    Homepage Promotional Posters & Special Offers
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Create high-impact promo banners featuring seasonal harvests, discounts, or rare strain releases.
                  </p>
                </div>
                <button
                  onClick={handleOpenPosterCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0055FF] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Offer Poster</span>
                </button>
              </div>

              {storeSettings?.posters && storeSettings.posters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {storeSettings.posters.map((poster) => (
                    <div
                      key={poster.id}
                      className="border border-[#E2E8F0] rounded-xs overflow-hidden bg-white shadow-xs flex flex-col justify-between"
                    >
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <img
                          src={poster.imageUrl}
                          alt={poster.title}
                          className="w-full h-full object-cover filter brightness-[0.7]"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 bg-[#0055FF] text-white text-[10px] font-bold uppercase tracking-wider rounded-xs">
                            {poster.tag}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => handleTogglePosterActive(poster)}
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                              poster.active
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-600 text-white"
                            }`}
                          >
                            {poster.active ? "Active" : "Disabled"}
                          </button>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-[#020617]">{poster.title}</h4>
                          <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                            {poster.subtitle}
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#64748B]">
                            <span className="font-medium text-[#020617]">Link:</span>
                            <code className="bg-slate-100 px-1 py-0.5 rounded-xs font-mono">
                              {poster.link}
                            </code>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E2E8F0]">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">
                            Order #{poster.displayOrder}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenPosterEdit(poster)}
                              className="p-1.5 text-slate-600 hover:text-[#0055FF] hover:bg-blue-50 rounded-xs"
                              title="Edit Poster"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePoster(poster.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xs"
                              title="Delete Poster"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 border border-dashed border-[#E2E8F0] text-center rounded-xs text-[#64748B]">
                  <p className="text-xs">No promotional posters configured. Click "Add Offer Poster" to create one.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CUSTOMER INQUIRIES & ORDER AUDITS */}
        {/* ========================================================= */}
        {activeTab === "audits" && (
          <div className="space-y-6">
            {/* Header & Filter */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xs shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#020617]">
                  Customer Checkout & Manifest Audits
                </h3>
                <p className="text-xs text-[#64748B]">
                  Real-time audit log of WhatsApp bill generations, customer details, and consignment statuses.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={auditStatusFilter}
                  onChange={(e) => setAuditStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                >
                  <option value="all">All Audits ({orderAudits.length})</option>
                  <option value="Inquiry Sent">Inquiry Sent</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Audit Log Cards */}
            <div className="space-y-4">
              {filteredAudits.length === 0 ? (
                <div className="bg-white border border-[#E2E8F0] p-12 text-center text-[#64748B] rounded-xs">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">No customer orders or inquiries recorded yet.</p>
                </div>
              ) : (
                filteredAudits.map((audit) => {
                  const cleanedPhone = (audit.phone || "").replace(/[^0-9]/g, "");
                  const directWhatsAppUrl = cleanedPhone
                    ? `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
                        `Hello ${audit.customerName}, regarding your HS Aquatics Order #${audit.orderNumber}:`
                      )}`
                    : null;

                  return (
                    <div
                      key={audit.id}
                      className="bg-white border border-[#E2E8F0] rounded-xs p-5 shadow-xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-[#0055FF] bg-blue-50 px-2 py-1 rounded-xs border border-blue-200">
                            #{audit.orderNumber}
                          </span>
                          <div>
                            <span className="font-bold text-sm text-[#020617] block">
                              {audit.customerName}
                            </span>
                            <span className="text-[11px] text-[#64748B]">
                              {new Date(audit.createdAt).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                              Estimated Total
                            </span>
                            <span className="font-bold text-base text-[#020617]">
                              {formatCurrency(audit.totalAmount)}
                            </span>
                          </div>

                          {/* Status Selector Dropdown */}
                          <select
                            value={audit.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                audit.id,
                                e.target.value as CustomerOrderAudit["status"]
                              )
                            }
                            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs border focus:outline-none ${
                              audit.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : audit.status === "Dispatched"
                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                : audit.status === "Confirmed"
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            <option value="Inquiry Sent">Inquiry Sent</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => handleDeleteAudit(audit.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-xs"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Middle Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                        {/* Customer & Location */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                            Consignee Details
                          </span>
                          <div className="flex items-center gap-2 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {audit.city}, {audit.state} - PIN: <strong>{audit.pinCode}</strong>
                            </span>
                          </div>
                          {audit.phone && (
                            <div className="flex items-center gap-2 text-slate-700">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{audit.phone}</span>
                            </div>
                          )}
                          {audit.notes && (
                            <p className="text-[11px] text-slate-500 italic mt-2 bg-slate-50 p-2 rounded-xs border border-slate-200">
                              Note: {audit.notes}
                            </p>
                          )}
                        </div>

                        {/* Species Ordered */}
                        <div className="md:col-span-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                            Specimens Manifest ({audit.items.length})
                          </span>
                          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xs bg-slate-50 p-2 max-h-36 overflow-y-auto">
                            {audit.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-1 text-xs"
                              >
                                <span className="font-medium text-[#020617]">
                                  {item.quantity} × {item.name}
                                </span>
                                <span className="font-semibold text-slate-700">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      {directWhatsAppUrl && (
                        <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
                          <a
                            href={directWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-semibold rounded-xs transition-colors shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Reply to Customer on WhatsApp</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: STORE & WHATSAPP DESK */}
        {/* ========================================================= */}
        {activeTab === "store" && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xs shadow-xs">
              <div className="mb-6 pb-3 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#020617]">
                  Store Profile & WhatsApp Order Concierge
                </h3>
                <p className="text-xs text-[#64748B]">
                  Configure your primary WhatsApp order receiver number, facility contact, and dispatch policies.
                </p>
              </div>

              {storeSettings && (
                <form onSubmit={handleSaveStoreGeneral} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeSettings.siteName}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, siteName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Store Tagline
                      </label>
                      <input
                        type="text"
                        value={storeSettings.tagline}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, tagline: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        WhatsApp Number for Receiving Orders (No spaces or plus, e.g. 918098147347)
                      </label>
                      <input
                        type="text"
                        value={storeSettings.whatsappNumber}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                        placeholder="918098147347"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Display WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={storeSettings.whatsappDisplay}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, whatsappDisplay: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                        placeholder="+91 80981 47347"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={storeSettings.supportEmail}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, supportEmail: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Dispatch & Operating Hours
                      </label>
                      <input
                        type="text"
                        value={storeSettings.hours}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, hours: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Facility Physical Address
                    </label>
                    <input
                      type="text"
                      value={storeSettings.address}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, address: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                      Live Arrival Guarantee (DOA) Terms Copy
                    </label>
                    <textarea
                      rows={2}
                      value={storeSettings.doaGuaranteeText}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, doaGuaranteeText: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0055FF] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Store Settings</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/50 border border-red-200 p-6 rounded-xs shadow-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-red-800 mb-1">
                Catalogue Reset & Reseeding
              </h3>
              <p className="text-xs text-red-600 mb-4">
                Restore the default curated catalogue of quarantined fish and default categories.
              </p>
              <button
                onClick={handleResetToDefaults}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Entire Catalogue to Default</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* PRODUCT CREATE / EDIT MODAL */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E2E8F0] rounded-xs max-w-2xl w-full p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#020617]">
                {editingProduct ? `Edit Specimen: ${editingProduct.name}` : "Add New Live Specimen"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Fish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.name || ""}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, name: e.target.value })
                    }
                    placeholder="e.g. Orinoco Altum Angelfish"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Category *
                  </label>
                  <select
                    value={productFormData.categoryId || "angelfish"}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                  >
                    {categories
                      .filter((c) => c.slug !== "all")
                      .map((c) => (
                        <option key={c.categoryId} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Scientific Name (Italicized)
                  </label>
                  <input
                    type="text"
                    value={productFormData.scientificName || ""}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, scientificName: e.target.value })
                    }
                    placeholder="e.g. Pterophyllum altum"
                    className="w-full px-3 py-2 text-xs italic bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Specimen Size
                  </label>
                  <input
                    type="text"
                    value={productFormData.size || ""}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, size: e.target.value })
                    }
                    placeholder='e.g. 2.0" - 2.5"'
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productFormData.sellingPrice || ""}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        sellingPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={productFormData.originalPrice || ""}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Stock Availability
                  </label>
                  <select
                    value={productFormData.availability || "in_stock"}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        availability: e.target.value as "in_stock" | "out_of_stock",
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Featured Item?
                  </label>
                  <div className="flex items-center h-9">
                    <input
                      type="checkbox"
                      id="featCheck"
                      checked={!!productFormData.featured}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, featured: e.target.checked })
                      }
                      className="w-4 h-4 text-[#0055FF] rounded-xs"
                    />
                    <label htmlFor="featCheck" className="ml-2 text-xs text-slate-700 cursor-pointer">
                      Feature on Home
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Primary Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={productFormData.images?.[0] || ""}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      images: [e.target.value, ...(productFormData.images?.slice(1) || [])],
                    })
                  }
                  placeholder="/images/fish/angels-altum-angel.webp"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Description & Quarantine Notes
                </label>
                <textarea
                  rows={3}
                  value={productFormData.description || ""}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              {/* Care Specifications */}
              <div className="pt-2 border-t border-[#E2E8F0]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Care Parameters
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block">Tank Size</label>
                    <input
                      type="text"
                      value={productFormData.careInformation?.tankSize || "30+ Gallons"}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          careInformation: {
                            ...(productFormData.careInformation as any),
                            tankSize: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2 py-1 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Temperature</label>
                    <input
                      type="text"
                      value={productFormData.careInformation?.temperature || "24°C - 28°C"}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          careInformation: {
                            ...(productFormData.careInformation as any),
                            temperature: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2 py-1 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">pH Range</label>
                    <input
                      type="text"
                      value={productFormData.careInformation?.phRange || "6.5 - 7.5"}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          careInformation: {
                            ...(productFormData.careInformation as any),
                            phRange: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2 py-1 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0055FF] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Specimen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* COLLECTION CREATE / EDIT MODAL */}
      {/* ========================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xs max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#020617]">
                {editingCategory ? `Edit: ${editingCategory.name}` : "Add New Collection"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryModal} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name || ""}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, name: e.target.value })
                  }
                  placeholder="e.g. Discus Strains"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={categoryFormData.slug || ""}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, slug: e.target.value })
                  }
                  placeholder="discus-strains"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Card Cover Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormData.image || ""}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, image: e.target.value })
                  }
                  placeholder="/images/fish/angels-altum-angel.webp"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={categoryFormData.displayOrder || 1}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        displayOrder: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Status
                  </label>
                  <select
                    value={categoryFormData.active ? "true" : "false"}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        active: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#0055FF] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Collection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PROMO POSTER CREATE / EDIT MODAL */}
      {/* ========================================================= */}
      {isPosterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xs max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#020617]">
                {editingPoster ? "Edit Promotional Poster" : "Create Special Offer Poster"}
              </h3>
              <button
                onClick={() => setIsPosterModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePosterModal} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={posterFormData.title || ""}
                  onChange={(e) =>
                    setPosterFormData({ ...posterFormData, title: e.target.value })
                  }
                  placeholder="e.g. Wild Orinoco Altum & Angelfish Pairs"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Tag / Discount Badge
                </label>
                <input
                  type="text"
                  value={posterFormData.tag || ""}
                  onChange={(e) =>
                    setPosterFormData({ ...posterFormData, tag: e.target.value })
                  }
                  placeholder="e.g. SPECIAL HARVEST or 30% OFF"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={posterFormData.subtitle || ""}
                  onChange={(e) =>
                    setPosterFormData({ ...posterFormData, subtitle: e.target.value })
                  }
                  placeholder="Quarantined and biologically conditioned for immediate train dispatch."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Poster Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={posterFormData.imageUrl || ""}
                  onChange={(e) =>
                    setPosterFormData({ ...posterFormData, imageUrl: e.target.value })
                  }
                  placeholder="/images/fish/angels-altum-angel.webp"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs focus:bg-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={posterFormData.buttonText || "Shop Collection"}
                    onChange={(e) =>
                      setPosterFormData({ ...posterFormData, buttonText: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Button Destination Link
                  </label>
                  <input
                    type="text"
                    value={posterFormData.link || "/fish"}
                    onChange={(e) =>
                      setPosterFormData({ ...posterFormData, link: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={posterFormData.displayOrder || 1}
                    onChange={(e) =>
                      setPosterFormData({
                        ...posterFormData,
                        displayOrder: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Active Status
                  </label>
                  <select
                    value={posterFormData.active ? "true" : "false"}
                    onChange={(e) =>
                      setPosterFormData({
                        ...posterFormData,
                        active: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xs"
                  >
                    <option value="true">Active (Show on Home)</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#0055FF] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Poster</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
