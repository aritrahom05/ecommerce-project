import {
  useEffect,
  useState,
} from "react";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  image: "",
  category: "",
  stock: "",
};

export default function AdminProducts() {
  const [products, setProducts] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const token =
    localStorage.getItem("token");

  const fetchProducts = () => {
    fetch(
      "http://localhost:5000/api/products"
    )
      .then((res) => res.json())
      .then((data) =>
        setProducts(data)
      );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateField = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    const method = editingId
      ? "PUT"
      : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      setMessage(
        "Product save failed. Please login as admin."
      );
      return;
    }

    setMessage(
      editingId
        ? "Product updated"
        : "Product added"
    );
    resetForm();
    fetchProducts();
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      description:
        product.description || "",
      image: product.image || "",
      category: product.category || "",
      stock: product.stock || 0,
    });
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Delete this product?"
    );

    if (!confirmed) return;

    const res = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      setMessage(
        "Delete failed. Please login as admin."
      );
      return;
    }

    fetchProducts();
  };

  return (
    <div style={pageStyle}>
      <h1>Manage Products</h1>

      {message && (
        <p style={messageStyle}>
          {message}
        </p>
      )}

      <form
        onSubmit={saveProduct}
        style={formStyle}
      >
        <input
          style={inputStyle}
          placeholder="Product name"
          value={form.name}
          onChange={(e) =>
            updateField(
              "name",
              e.target.value
            )
          }
          required
        />

        <input
          style={inputStyle}
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) =>
            updateField(
              "price",
              e.target.value
            )
          }
          required
        />

        <input
          style={inputStyle}
          placeholder="Stock left"
          type="number"
          value={form.stock}
          onChange={(e) =>
            updateField(
              "stock",
              e.target.value
            )
          }
          required
        />

        <input
          style={inputStyle}
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            updateField(
              "category",
              e.target.value
            )
          }
        />

        <input
          style={inputStyle}
          placeholder="Image URL"
          value={form.image}
          onChange={(e) =>
            updateField(
              "image",
              e.target.value
            )
          }
        />

        <textarea
          style={textareaStyle}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
        />

        <div style={buttonRowStyle}>
          <button style={primaryButton}>
            {editingId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={secondaryButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td style={tdStyle}>
                  {product.name}
                </td>
                <td style={tdStyle}>
                  Rs {product.price}
                </td>
                <td style={tdStyle}>
                  {product.stock || 0}
                </td>
                <td style={tdStyle}>
                  {product.category}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() =>
                      editProduct(product)
                    }
                    style={smallButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deleteProduct(
                        product._id
                      )
                    }
                    style={dangerButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "30px",
  background: "#f3f4f6",
};

const messageStyle = {
  background: "#dbeafe",
  color: "#1e3a8a",
  padding: "12px",
  borderRadius: "8px",
};

const formStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  display: "grid",
  gap: "12px",
  marginBottom: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "90px",
};

const buttonRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const primaryButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const secondaryButton = {
  ...primaryButton,
  background: "#64748b",
};

const tableWrapStyle = {
  background: "white",
  borderRadius: "12px",
  overflowX: "auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
};

const smallButton = {
  ...primaryButton,
  padding: "8px 12px",
  marginRight: "8px",
};

const dangerButton = {
  ...smallButton,
  background: "#ef4444",
};
