import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Product, Category, StoreSettings, CustomerOrderAudit } from "@/types";

interface StoreData {
  products: Product[];
  categories: Category[];
  fishCategories: Category[];
  settings: StoreSettings;
  orderAudits: CustomerOrderAudit[];
}

function getStoreDataPath(): string {
  return path.join(process.cwd(), "src", "data", "storeData.json");
}

function readStoreData(): StoreData | null {
  try {
    const filePath = getStoreDataPath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as StoreData;
    }
  } catch (err) {
    console.error("Error reading storeData.json:", err);
  }
  return null;
}

function writeStoreData(data: StoreData): boolean {
  try {
    const filePath = getStoreDataPath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Could not write storeData.json directly (read-only filesystem or serverless):", err);
    return false;
  }
}

export async function GET() {
  const data = readStoreData();
  if (!data) {
    return NextResponse.json({ success: false, message: "No store data found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = readStoreData() || {
      products: [],
      categories: [],
      fishCategories: [],
      settings: {} as StoreSettings,
      orderAudits: [],
    };

    const { action, payload, products, categories, settings, orderAudits } = body;

    // Direct multi-resource update
    if (products || categories || settings || orderAudits) {
      if (Array.isArray(products)) current.products = products;
      if (Array.isArray(categories)) current.categories = categories;
      if (settings) current.settings = settings;
      if (Array.isArray(orderAudits)) current.orderAudits = orderAudits;
      writeStoreData(current);
      return NextResponse.json({ success: true, message: "Store data updated", data: current });
    }

    // Action-based updates
    switch (action) {
      case "save_product": {
        const prod = payload as Product;
        const idx = current.products.findIndex((p) => p.productId === prod.productId);
        if (idx >= 0) {
          current.products[idx] = prod;
        } else {
          current.products.unshift(prod);
        }
        writeStoreData(current);
        return NextResponse.json({ success: true, action: "save_product", product: prod });
      }

      case "delete_product": {
        const { productId } = payload;
        current.products = current.products.filter((p) => p.productId !== productId);
        writeStoreData(current);
        return NextResponse.json({ success: true, action: "delete_product", productId });
      }

      case "save_category": {
        const cat = payload as Category;
        const idx = current.categories.findIndex((c) => c.categoryId === cat.categoryId);
        if (idx >= 0) {
          current.categories[idx] = cat;
        } else {
          current.categories.push(cat);
        }
        writeStoreData(current);
        return NextResponse.json({ success: true, action: "save_category", category: cat });
      }

      case "delete_category": {
        const { categoryId } = payload;
        current.categories = current.categories.filter((c) => c.categoryId !== categoryId);
        writeStoreData(current);
        return NextResponse.json({ success: true, action: "delete_category", categoryId });
      }

      case "save_settings": {
        const updatedSettings = { ...current.settings, ...payload };
        current.settings = updatedSettings;
        writeStoreData(current);
        return NextResponse.json({ success: true, action: "save_settings", settings: updatedSettings });
      }

      case "save_audit": {
        const audit = payload as CustomerOrderAudit;
        const idx = current.orderAudits.findIndex((a) => a.id === audit.id);
        if (idx >= 0) {
          current.orderAudits[idx] = audit;
        } else {
          current.orderAudits.unshift(audit);
        }
        writeStoreData(current);
        return NextResponse.json({ success: true, action: "save_audit", audit });
      }

      default:
        return NextResponse.json({ success: false, message: `Unknown action ${action}` }, { status: 400 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
