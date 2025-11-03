"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "react-hot-toast";
import api from "../../lib/axios.js";
import FilterBar from "../../components/FilterBar.jsx";
import EditProductModal from "./EditProductModal.jsx";
import Spinner from "../../components/Spinner.jsx";

export default function AdminProductsPage() {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    minPrice: 0,
    maxPrice: Infinity,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await api.get("/users/me");
        if (data.role !== "admin") {
          toast.error(t("unauthorized"));
          router.push("/");
        }
      } catch (err) {
        toast.error(t("unauthorized"));
        router.push("/");
      }
    };
    checkAdmin();
  }, [router, t]);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      toast.error(t("failedLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleReset = () => {
    setFilters({ category: "all", brand: "all", minPrice: 0, maxPrice: Infinity });
  };

  const filtered = products.filter((p) => {
    const matchCategory =
      filters.category === "all" || p.category?.[locale] === filters.category;
    const matchBrand = filters.brand === "all" || p.brand === filters.brand;
    const matchPrice =
      p.price >= filters.minPrice && p.price <= filters.maxPrice;
    return matchCategory && matchBrand && matchPrice;
  });

  const handleDelete = async (id) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success(t("deleted"));
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(t("failedDelete"));
    }
  };

  // Handles both create (isNew=true) and update (isNew=false)
  const handleSaveEdit = async (updated, isNew) => {
    try {
      const formData = new FormData();

      // For create route your backend expects req.body.data (stringified JSON)
      if (isNew) {
        const payload = {
          name: updated.name,
          description: updated.description,
          category: updated.category,
          brand: updated.brand,
          price: updated.price,
          discount: updated.discount,
          stock: updated.stock,
        };
        formData.append("data", JSON.stringify(payload));

        // Append main image file if provided
        if (updated.mainImage?.file) {
          formData.append("images", updated.mainImage.file); // backend will treat first uploaded as main if you set it that way
        }

        // Append gallery images files
        updated.images?.forEach((img) => {
          if (img.file) formData.append("images", img.file);
        });

        // POST to create
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success(t("created") || "Product created");
      } else {
        // Update existing product (PUT /api/products/:id)
        if (!updated._id) {
          console.error("❌ Trying to update without _id", updated);
          toast.error("Missing product ID");
          return;
        }

        // Backend updateProduct expects fields in req.body and will try to JSON.parse
        // name, description, category if they are stringified.
        formData.append("name", JSON.stringify(updated.name));
        formData.append("description", JSON.stringify(updated.description));
        formData.append("category", JSON.stringify(updated.category));
        formData.append("brand", updated.brand || "");
        formData.append("price", updated.price ?? 0);
        formData.append("discount", updated.discount ?? 0);
        formData.append("stock", updated.stock ?? 0);

        // main image file (optional)
        if (updated.mainImage?.file) {
          formData.append("images", updated.mainImage.file);
        }

        // gallery files
        updated.images?.forEach((img) => {
          if (img.file) formData.append("images", img.file);
        });

        await api.put(`/products/${updated._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success(t("updated") || "Product updated");
      }

      setEditingProduct(null);
      setAdding(false);
      fetchProducts();
    } catch (err) {
      console.error("❌ Error saving product:", err);
      toast.error("Save failed!");
    }
  };

  const handleAddProduct = () => {
    setAdding(true);
    setEditingProduct({
      // no _id for new products
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      category: { en: "", ar: "" },
      brand: "",
      price: 0,
      discount: 0,
      stock: 0,
      images: [],
      mainImage: { url: "", public_id: "" },
      _id: "",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spinner size={50} color="#a28533" />
      </div>
    );

  return (
    <section className="min-h-[90vh] py-10 px-6 md:px-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#a28533]">{t("titleProducts")}</h1>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-[#a28533] text-white rounded-lg hover:bg-[#8e7328]"
        >
          + {t("addProduct")}
        </button>
      </div>

      <FilterBar
        products={products}
        filters={filters}
        setFilters={setFilters}
        onReset={handleReset}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="bg-white dark:bg-[#111d44] p-4 rounded-xl shadow-md relative"
          >
            <div className="relative w-full aspect-square mb-3">
              <Image
                src={p.mainImage?.url || p.images?.[0]?.url || "/placeholder.png"}
                alt={p.name?.[locale]}
                fill
                className="object-contain rounded-lg bg-white"
              />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {p.name?.[locale]}
            </h3>
            <p className="text-[#a28533] font-bold">
              {locale === "en" ? "LE" : "ج"} {Number(p.price).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{p.brand}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setEditingProduct(p);
                  setAdding(false);
                }}
                className="flex-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t("editProduct")}
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="flex-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isNew={adding}
          onClose={() => {
            setEditingProduct(null);
            setAdding(false);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </section>
  );
}
