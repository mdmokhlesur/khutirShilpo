"use client";

import useAuthContext from "@/hook/useAuthContext";
import { formatIsoDate } from "@/utils/formatDate";
import { UploadButton } from "@/utils/uploadthing";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const emptyProduct = {
  id: "",
  title: "",
  image: "",
  price: "",
  category: "bamboo",
  description: "",
  quantity: "",
  sells: "",
  madeDate: "",
  manufactureAuthority: "",
  location: "",
  active: true,
};

const AdminProductManagement = () => {
  const { user } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(() => {
    if (!user?.email) return;

    setLoading(true);
    fetch(`/api/admin/stats?email=${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Products not found");
        return res.json();
      })
      .then((data) => {
        setProducts(data?.products || []);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (product) => {
    setEditingId(product?._id);
    setForm({
      id: product?._id || "",
      title: product?.title || "",
      image: product?.image || "",
      price: product?.price || "",
      category: product?.category || "bamboo",
      description: product?.description || "",
      quantity: product?.quantity || "",
      sells: product?.sells || "",
      madeDate: formatIsoDate(product?.madeDate) || "",
      manufactureAuthority: product?.manufactureAuthority || "",
      location: product?.location || "",
      active: product?.active !== false,
    });
  };

  const resetForm = () => {
    setEditingId("");
    setForm(emptyProduct);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const url = editingId
      ? `/api/product`
      : `/api/products`;
    const method = editingId ? "PATCH" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        id: editingId || form.id,
        adminEmail: user?.email,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Product save failed");
        return res.json();
      })
      .then(() => {
        toast.success(editingId ? "Product updated" : "Product added");
        resetForm();
        loadProducts();
      })
      .catch((error) => toast.error(error.message));
  };

  const inactiveProduct = (id) => {
    fetch(`/api/product?id=${id}&adminEmail=${user?.email}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Inactive failed");
        return res.json();
      })
      .then(() => {
        toast.success("Product marked inactive");
        loadProducts();
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#6f827e]">Inventory</p>
        <h1 className="text-2xl font-bold">Product Management</h1>
      </div>

      <div className="grid gap-5 xl:grid-cols-[390px_1fr]">
        <form onSubmit={handleSubmit} className="space-y-3 rounded bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{editingId ? "Edit Product" : "Add Product"}</h2>
            <span className="rounded bg-[#d9f8ef] px-3 py-1 text-xs font-semibold text-[#13856e]">
              {editingId ? "Update" : "New"}
            </span>
          </div>

          <input name="title" value={form.title} onChange={handleChange} required className="w-full rounded border border-[#d7e8e3] p-2" placeholder="Product title" />
          <div className="grid grid-cols-2 gap-2">
            <input name="price" value={form.price} onChange={handleChange} type="number" className="rounded border border-[#d7e8e3] p-2" placeholder="Price" />
            <input name="quantity" value={form.quantity} onChange={handleChange} type="number" className="rounded border border-[#d7e8e3] p-2" placeholder="Quantity" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select name="category" value={form.category} onChange={handleChange} className="rounded border border-[#d7e8e3] p-2">
              <option value="bamboo">Bamboo</option>
              <option value="clay">Clay</option>
              <option value="glass">Glass</option>
            </select>
            <input name="sells" value={form.sells} onChange={handleChange} type="number" className="rounded border border-[#d7e8e3] p-2" placeholder="Sells" />
          </div>
          <input name="madeDate" value={form.madeDate} onChange={handleChange} type="date" className="w-full rounded border border-[#d7e8e3] p-2" />
          <input name="manufactureAuthority" value={form.manufactureAuthority} onChange={handleChange} className="w-full rounded border border-[#d7e8e3] p-2" placeholder="Manufacture authority" />
          <input name="location" value={form.location} onChange={handleChange} className="w-full rounded border border-[#d7e8e3] p-2" placeholder="Location" />
          <textarea name="description" value={form.description} onChange={handleChange} className="min-h-[90px] w-full rounded border border-[#d7e8e3] p-2" placeholder="Description" />
          {form.image && (
            <div className="overflow-hidden rounded border border-[#d7e8e3] bg-[#f7fbfa]">
              <Image
                src={form.image}
                alt={form.title || "Product preview"}
                width={360}
                height={220}
                className="h-44 w-full object-cover"
              />
            </div>
          )}
          <UploadButton
            endpoint="productImage"
            onClientUploadComplete={(res) => {
              const uploadedUrl = res?.[0]?.ufsUrl || res?.[0]?.url || res?.[0]?.serverData?.url;
              if (uploadedUrl) {
                setForm((current) => ({ ...current, image: uploadedUrl }));
                toast.success("Image uploaded");
              }
            }}
            onUploadError={(error) => toast.error(error.message)}
          />
          <label className="flex items-center gap-2 text-sm">
            <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
            Active product
          </label>
          <div className="flex gap-2">
            <button className="rounded bg-[#62d5bd] px-4 py-2 font-semibold text-[#123b34]" type="submit">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button className="rounded border px-4 py-2" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="rounded bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">All Products</h2>
            <span className="text-sm text-[#6f827e]">{products.length} items</span>
          </div>

          {loading ? (
            <div className="loader mt-10"></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b text-left text-sm text-[#6f827e]">
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product?._id} className="border-b last:border-0">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded bg-[#eef7f4]">
                            {product?.image && (
                              <Image src={product.image} alt={product.title} width={48} height={48} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{product?.title}</p>
                            <p className="text-xs text-[#6f827e]">{product?.manufactureAuthority || "Kutir Shilpo"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 capitalize">{product?.category}</td>
                      <td className="p-3 text-right">৳ {product?.price}</td>
                      <td className="p-3 text-center">
                        <span className={`rounded px-3 py-1 text-xs font-semibold ${product?.active === false ? "bg-red-50 text-red-600" : "bg-[#d9f8ef] text-[#13856e]"}`}>
                          {product?.active === false ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <button className="rounded border px-3 py-2" onClick={() => handleEdit(product)} title="Edit">
                            <Icon icon="heroicons-outline:pencil" />
                          </button>
                          <button className="rounded border px-3 py-2 text-red-600" onClick={() => inactiveProduct(product?._id)} title="Inactive">
                            <Icon icon="heroicons-outline:archive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminProductManagement;
