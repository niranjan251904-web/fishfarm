"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
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
} from "lucide-react";
import { Product, Category } from "@/types";
import {
  getProducts,
  getCategories,
  saveProduct,
  deleteProduct,
  seedCatalogue,
} from "@/lib/db";
import { isFirebaseConfigured, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit / Create Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    // Check if session admin login is persisted
    const savedAuth = sessionStorage.getItem("aura_admin_logged_in");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      loadCatalogueData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadCatalogueData = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p);
      setCategories(c);
    } catch (err) {
      console.error("Error loading catalogue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // If Firebase Auth is configured, attempt Firebase sign-in
    if (isFirebaseConfigured() && auth) {
      try {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        setIsAuthenticated(true);
        sessionStorage.setItem("aura_admin_logged_in", "true");
        loadCatalogueData();
        return;
      } catch (err: unknown) {
        console.warn("Firebase Auth error, checking fallback admin credentials:", err);
      }
    }

    // Default administrative credentials for local/demo/sandbox
    if (adminEmail === "admin@aura-aquatics.in" && adminPassword === "Aquarium2026!") {
      setIsAuthenticated(true);
      sessionStorage.setItem("aura_admin_logged_in", "true");
      loadCatalogueData();
    } else {
      setAuthError("Invalid credentials. Try: admin@aura-aquatics.in / Aquarium2026!");
    }
  };

  const handleLogout = () => {
    if (isFirebaseConfigured() && auth) {
      signOut(auth).catch(() => {});
    }
    sessionStorage.removeItem("aura_admin_logged_in");
    setIsAuthenticated(false);
  };

  // Quick Stock Toggle
  const handleToggleStock = async (product: Product) => {
    const newStatus: "in_stock" | "out_of_stock" =
      product.availability === "in_stock" ? "out_of_stock" : "in_stock";
    const updated: Product = {
      ...product,
      availability: newStatus,
      updatedAt: new Date().toISOString(),
    };
    await saveProduct(updated);
    setProducts((prev) =>
      prev.map((p) => (p.productId === product.productId ? updated : p))
    );
  };

  // Quick Featured Toggle
  const handleToggleFeatured = async (product: Product) => {
    const updated: Product = { ...product, featured: !product.featured, updatedAt: new Date().toISOString() };
    await saveProduct(updated);
    setProducts((prev) =>
      prev.map((p) => (p.productId === product.productId ? updated : p))
    );
  };

  // Quick Price Update
  const handleQuickPriceChange = async (product: Product, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) return;
    const updated: Product = { ...product, sellingPrice: newPrice, updatedAt: new Date().toISOString() };
    await saveProduct(updated);
    setProducts((prev) =>
      prev.map((p) => (p.productId === product.productId ? updated : p))
    );
  };

  // Delete product
  const handleDelete = async (productId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name} from the catalogue?`)) {
      return;
    }
    await deleteProduct(productId);
    setProducts((prev) => prev.filter((p) => p.productId !== productId));
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      categoryId: categories[1]?.slug || "angelfish",
      categoryName: categories[1]?.name || "Angelfish",
      scientificName: "",
      originalPrice: 200,
      sellingPrice: 150,
      availability: "in_stock",
      waterType: "freshwater",
      size: '2.0"',
      images: ["/images/fish/algae-eaters-otocinclus.jpg"],
      description: "Quarantined ornamental specimen.",
      featured: false,
      careInformation: {
        tankSize: "30+ Gallons",
        temperature: "24°C - 28°C",
        phRange: "6.5 - 7.5",
        temperament: "Peaceful",
        diet: "Omnivore",
        careLevel: "Beginner",
      },
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving...");

    const categoryObj = categories.find((c) => c.slug === formData.categoryId);
    const categoryName = categoryObj ? categoryObj.name : "Ornamental Fish";

    const productToSave: Product = {
      productId: editingProduct ? editingProduct.productId : `prod-${Date.now()}`,
      name: formData.name || "Unnamed Fish",
      slug:
        formData.slug ||
        (formData.name || "fish").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId: formData.categoryId || "angelfish",
      categoryName: categoryName,
      scientificName: formData.scientificName || "",
      originalPrice: Number(formData.originalPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      availability: (formData.availability as Product["availability"]) || "in_stock",
      waterType: (formData.waterType as Product["waterType"]) || "freshwater",
      size: formData.size || '2.0"',
      images:
        formData.images && formData.images.length > 0
          ? formData.images
          : ["/images/fish/algae-eaters-otocinclus.jpg"],
      description: formData.description || "",
      careInformation: formData.careInformation || {
        tankSize: "30+ Gallons",
        temperature: "24°C - 28°C",
        phRange: "6.5 - 7.5",
        temperament: "Peaceful",
        diet: "Omnivore",
        careLevel: "Beginner",
      },
      featured: Boolean(formData.featured),
      badge: formData.badge,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveProduct(productToSave);
    await loadCatalogueData();
    setSaveStatus("Saved successfully!");
    setTimeout(() => {
      setIsModalOpen(false);
      setSaveStatus("");
    }, 600);
  };

  // Seed / Reset Database
  const handleSeed = async () => {
    if (!window.confirm("Restore or seed the authentic 23+ species catalogue from source assets?")) {
      return;
    }
    setLoading(true);
    await seedCatalogue(true);
    await loadCatalogueData();
  };

  // Filter products by search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If Not Authenticated: Render Clean Luxury Admin Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-ivory-300 shadow-floating text-center">
          <div className="w-14 h-14 rounded-2xl bg-forest-900 text-ivory-50 flex items-center justify-center mx-auto mb-6 shadow-subtle">
            <Lock className="w-7 h-7 text-emerald-400" />
          </div>

          <span className="text-xs font-mono uppercase tracking-[0.25em] text-forest-700 font-bold block mb-1">
            Biosecurity Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mb-2">
            Sanctuary Admin Login
          </h1>
          <p className="text-xs text-forest-900/60 mb-6">
            Authorized access for inventory pricing, stock certification, and species catalogue management.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium text-left">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-forest-900 block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@aura-aquatics.in"
                className="w-full px-4 py-2.5 rounded-xl bg-ivory-100 border border-ivory-300 text-xs sm:text-sm text-forest-950 focus:outline-none focus:border-forest-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-forest-900 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-ivory-100 border border-ivory-300 text-xs sm:text-sm text-forest-950 focus:outline-none focus:border-forest-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-forest-900 text-ivory-50 text-xs font-bold uppercase tracking-wider hover:bg-forest-800 transition-colors shadow-elevated"
            >
              Sign In to Sanctuary Console
            </button>

            <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 text-[11px] text-forest-800/80 leading-relaxed text-center">
              <strong>Quick Demo Access:</strong>
              <br />
              Email: <code className="text-forest-900 font-mono">admin@aura-aquatics.in</code>
              <br />
              Pass: <code className="text-forest-900 font-mono">Aquarium2026!</code>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-subtle mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-forest-700 font-bold block">
                Sanctuary Operations
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isFirebaseConfigured()
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                {isFirebaseConfigured() ? "Firestore Live" : "Client Storage Active"}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">
              Aquarium Catalogue Admin Console
            </h1>
            <p className="text-xs text-forest-900/60 mt-1">
              Manage live stock statuses, selling prices, categories, and image assets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeed}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-forest-900 text-xs font-semibold border border-ivory-300 transition-colors disabled:opacity-50"
              title="Re-seed database with default authentic 23 species"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-forest-700 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Syncing..." : "Reset / Seed Catalogue"}</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-50 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add New Species</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-forest-700 hover:bg-ivory-200 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-subtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-forest-600 block">
              Total Species
            </span>
            <span className="font-serif text-3xl font-bold text-forest-950 mt-1 block">
              {products.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-subtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 block">
              In Stock & Ready
            </span>
            <span className="font-serif text-3xl font-bold text-emerald-800 mt-1 block">
              {products.filter((p) => p.availability === "in_stock").length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-subtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 block">
              Out of Stock
            </span>
            <span className="font-serif text-3xl font-bold text-rose-800 mt-1 block">
              {products.filter((p) => p.availability === "out_of_stock").length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-subtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-forest-600 block">
              Categories
            </span>
            <span className="font-serif text-3xl font-bold text-forest-950 mt-1 block">
              {categories.length}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-ivory-300 shadow-subtle mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-forest-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by species name, genus, or category..."
              className="w-full pl-10 pr-4 py-2 bg-ivory-100 rounded-xl text-xs sm:text-sm text-forest-950 placeholder-forest-900/40 border border-ivory-300 focus:outline-none focus:border-forest-700"
            />
          </div>

          <span className="text-xs text-forest-800 font-mono">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-ivory-300 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-ivory-100/80 border-b border-ivory-300 text-forest-700 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Specimen</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Selling Price (INR)</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredProducts.map((p) => {
                  const isOos = p.availability === "out_of_stock";
                  return (
                    <tr key={p.productId} className="hover:bg-ivory-50/70 transition-colors">
                      {/* Image & Specimen Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-ivory-200 shrink-0 border border-ivory-300">
                            <Image
                              src={p.images[0] || "/images/fish/algae-eaters-otocinclus.jpg"}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/fish/${p.slug}`}
                              target="_blank"
                              className="font-serif font-bold text-forest-950 text-sm hover:underline inline-flex items-center gap-1"
                            >
                              <span>{p.name}</span>
                              <ExternalLink className="w-3 h-3 text-forest-400" />
                            </Link>
                            <span className="text-[11px] italic text-forest-700 block font-serif">
                              {p.scientificName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-ivory-200 text-forest-800">
                          {p.categoryName}
                        </span>
                      </td>

                      {/* Price inline edit */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-forest-950">₹</span>
                          <input
                            type="number"
                            defaultValue={p.sellingPrice}
                            onBlur={(e) =>
                              handleQuickPriceChange(p, parseFloat(e.target.value))
                            }
                            className="w-20 px-2 py-1 bg-ivory-100 border border-ivory-300 rounded-lg text-xs font-bold text-forest-950 focus:outline-none focus:border-forest-700"
                          />
                          {p.originalPrice > p.sellingPrice && (
                            <span className="text-[10px] text-forest-400 line-through">
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Toggle Button */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStock(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                            isOos
                              ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {isOos ? (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              <span>Out of Stock</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>In Stock</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            p.featured
                              ? "text-amber-600 bg-amber-50"
                              : "text-forest-400 hover:bg-ivory-200"
                          }`}
                          title="Toggle homepage featured"
                        >
                          <span className="text-xs font-bold">★</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg text-forest-700 hover:bg-ivory-200 transition-colors"
                            title="Edit full species spec"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.productId, p.name)}
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete species"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit / Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-floating border border-ivory-300 p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200 mb-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
                {editingProduct ? `Edit ${editingProduct.name}` : "Add New Species"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-forest-700 hover:bg-ivory-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-forest-900 block mb-1">
                    Species Common Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Wild Altum Angel"
                    className="w-full px-3.5 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs sm:text-sm text-forest-950 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-forest-900 block mb-1">
                    Taxonomy / Scientific Name
                  </label>
                  <input
                    type="text"
                    value={formData.scientificName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, scientificName: e.target.value })
                    }
                    placeholder="e.g. Pterophyllum altum"
                    className="w-full px-3.5 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs sm:text-sm text-forest-950 focus:outline-none focus:border-forest-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-forest-900 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.categoryId || "angelfish"}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs font-medium text-forest-950 focus:outline-none focus:border-forest-700"
                  >
                    {categories
                      .filter((c) => c.slug !== "all")
                      .map((cat) => (
                        <option key={cat.categoryId} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-forest-900 block mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs sm:text-sm text-forest-950 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-forest-900 block mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.sellingPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sellingPrice: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs sm:text-sm text-forest-950 focus:outline-none focus:border-forest-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-forest-900 block mb-1">
                    Stock Availability
                  </label>
                  <select
                    value={formData.availability || "in_stock"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availability: e.target.value as Product["availability"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs font-medium text-forest-950 focus:outline-none focus:border-forest-700"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-forest-900 block mb-1">
                    Specimen Size
                  </label>
                  <input
                    type="text"
                    value={formData.size || ""}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder='e.g. 2.0" - 2.5"'
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs text-forest-950 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-forest-900 block mb-1">
                    Custom Badge (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Rare Wild Morph"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs text-forest-950 focus:outline-none focus:border-forest-700"
                  />
                </div>
              </div>

              {/* Primary Image Path */}
              <div>
                <label className="text-xs font-bold text-forest-900 block mb-1">
                  Primary Image Path / URL
                </label>
                <input
                  type="text"
                  value={formData.images?.[0] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: [e.target.value, ...(formData.images?.slice(1) || [])],
                    })
                  }
                  placeholder="/images/fish/angels-altum-angel.webp"
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs font-mono text-forest-950 focus:outline-none focus:border-forest-700"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-forest-900 block mb-1">
                  Description & Care Information
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs text-forest-950 focus:outline-none focus:border-forest-700"
                />
              </div>

              {/* Tank parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-forest-700 block mb-1">
                    Tank Size
                  </label>
                  <input
                    type="text"
                    value={formData.careInformation?.tankSize || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        careInformation: {
                          ...formData.careInformation!,
                          tankSize: e.target.value,
                        },
                      })
                    }
                    placeholder="30+ Gallons"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-ivory-100 border border-ivory-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-forest-700 block mb-1">
                    Temperature
                  </label>
                  <input
                    type="text"
                    value={formData.careInformation?.temperature || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        careInformation: {
                          ...formData.careInformation!,
                          temperature: e.target.value,
                        },
                      })
                    }
                    placeholder="24°C - 28°C"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-ivory-100 border border-ivory-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-forest-700 block mb-1">
                    pH Range
                  </label>
                  <input
                    type="text"
                    value={formData.careInformation?.phRange || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        careInformation: {
                          ...formData.careInformation!,
                          phRange: e.target.value,
                        },
                      })
                    }
                    placeholder="6.5 - 7.5"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-ivory-100 border border-ivory-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-forest-700 block mb-1">
                    Diet
                  </label>
                  <input
                    type="text"
                    value={formData.careInformation?.diet || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        careInformation: {
                          ...formData.careInformation!,
                          diet: e.target.value,
                        },
                      })
                    }
                    placeholder="Omnivore"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-ivory-100 border border-ivory-300 text-xs"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={Boolean(formData.featured)}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded text-forest-900 focus:ring-forest-700"
                />
                <label htmlFor="featuredToggle" className="text-xs font-bold text-forest-900 cursor-pointer">
                  Feature this fish on Homepage Best Sellers / Spotlight
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-ivory-200">
                <span className="text-xs text-forest-600 font-medium">
                  {saveStatus}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-ivory-300 text-xs font-semibold text-forest-700 hover:bg-ivory-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-forest-900 text-ivory-50 text-xs font-bold uppercase tracking-wider hover:bg-forest-800 transition-colors shadow-md"
                  >
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>Save Species</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
