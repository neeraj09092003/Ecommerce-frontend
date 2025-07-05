import { useEffect, useState } from "react";
import axios from "axios";

const PRODUCTS_PER_PAGE = 8;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  });
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");

  // Fetch products
  const fetchAdminProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://ecommerce-backend-291k.onrender.com/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      alert("❌ Failed to fetch admin products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  // Search and Pagination
  useEffect(() => {
    let filtered = products;
    if (search.trim()) {
      filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    setDisplayed(filtered.slice(start, start + PRODUCTS_PER_PAGE));
  }, [products, search, page]);

  // Validation helpers
  const isValidImageUrl = (url) =>
    /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url);

  const validateProduct = (prod) => {
    if (
      !prod.name.trim() ||
      !prod.category.trim() ||
      !prod.image.trim() ||
      !prod.description.trim()
    )
      return "All fields are required.";
    if (prod.price === "" || isNaN(prod.price) || Number(prod.price) < 0)
      return "Price must be a non-negative number.";
    if (prod.stock === "" || isNaN(prod.stock) || Number(prod.stock) < 0)
      return "Stock must be a non-negative number.";
    if (!isValidImageUrl(prod.image))
      return "Image URL must be a valid image link (jpg, png, webp, gif).";
    return null;
  };

  // Add Product
  const handleAddProduct = async () => {
    if (adding) return;
    const error = validateProduct(newProduct);
    if (error) {
      alert(error);
      return;
    }
    setAdding(true);
    try {
      await axios.post("http://ecommerce-backend-291k.onrender.com/api/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Product added!");
      setShowModal(false);
      setNewProduct({
        name: "",
        price: "",
        category: "",
        stock: "",
        image: "",
        description: "",
      });
      fetchAdminProducts();
    } catch (err) {
      alert("❌ Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  // Edit Product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      description: product.description || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async () => {
    if (editing) return;
    const error = validateProduct(editForm);
    if (error) {
      alert(error);
      return;
    }
    setEditing(true);
    try {
      await axios.put(
        `http://ecommerce-backend-291k.onrender.com/api/products/${editingProduct._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Product updated!");
      setEditingProduct(null);
      fetchAdminProducts();
    } catch (err) {
      alert("❌ Failed to update product");
    } finally {
      setEditing(false);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://ecommerce-backend-291k.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted!");
    } catch (err) {
      alert("❌ Failed to delete product");
    }
  };

  // Pagination
  const totalPages = Math.ceil(
    (search.trim()
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        ).length
      : products.length) / PRODUCTS_PER_PAGE
  );

  if (loading) return <div className="p-4">Loading products...</div>;

  return (
    <div className="p-2 sm:p-4 overflow-x-auto">
      <h1 className="text-lg sm:text-2xl font-bold mb-4">🛍️ Admin - All Products</h1>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 items-stretch sm:items-center justify-between">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          ➕ Add New Product
        </button>
        <input
          type="text"
          placeholder="Search by name or category..."
          className="border px-3 py-2 rounded w-full sm:w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full border border-gray-300 text-xs sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-2 sm:px-4 border">Image</th>
              <th className="py-2 px-2 sm:px-4 border">Name</th>
              <th className="py-2 px-2 sm:px-4 border">Price</th>
              <th className="py-2 px-2 sm:px-4 border">Category</th>
              <th className="py-2 px-2 sm:px-4 border">Stock</th>
              <th className="py-2 px-2 sm:px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              displayed.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-1 sm:p-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-1 sm:p-2">{p.name}</td>
                  <td className="p-1 sm:p-2">₹{p.price}</td>
                  <td className="p-1 sm:p-2">{p.category}</td>
                  <td className="p-1 sm:p-2">{p.stock}</td>
                  <td className="p-1 sm:p-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 mr-2 rounded text-xs sm:text-sm"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Add New Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded shadow-md w-full max-w-md mx-2">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Add New Product</h2>
            <div className="space-y-2">
              {["name", "price", "category", "stock", "image"].map((field) => (
                <input
                  key={field}
                  type={field === "price" || field === "stock" ? "number" : "text"}
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  value={newProduct[field]}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, [field]: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                />
              ))}
              <textarea
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                rows={3}
              />
              {newProduct.image && isValidImageUrl(newProduct.image) && (
                <img
                  src={newProduct.image}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded mx-auto mt-2"
                />
              )}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm sm:text-base"
                disabled={adding}
              >
                {adding ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded shadow-md w-full max-w-md mx-2">
            <h2 className="text-lg sm:text-xl font-bold mb-4">✏️ Edit Product</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editForm.name}
              onChange={handleEditChange}
              className="w-full p-2 mb-2 border rounded text-sm sm:text-base"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={editForm.price}
              onChange={handleEditChange}
              className="w-full p-2 mb-2 border rounded text-sm sm:text-base"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={editForm.category}
              onChange={handleEditChange}
              className="w-full p-2 mb-2 border rounded text-sm sm:text-base"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={editForm.stock}
              onChange={handleEditChange}
              className="w-full p-2 mb-2 border rounded text-sm sm:text-base"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={editForm.image}
              onChange={handleEditChange}
              className="w-full p-2 mb-2 border rounded text-sm sm:text-base"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={editForm.description}
              onChange={handleEditChange}
              className="w-full border px-3 py-2 rounded text-sm sm:text-base mb-2"
              rows={3}
            />
            {editForm.image && isValidImageUrl(editForm.image) && (
              <img
                src={editForm.image}
                alt="Preview"
                className="w-24 h-24 object-cover rounded mx-auto mb-2"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base"
                disabled={editing}
              >
                {editing ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;