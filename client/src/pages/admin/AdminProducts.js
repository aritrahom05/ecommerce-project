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
        ? "Product updated successfully"
        : "Product added successfully"
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
    const confirmed =
      window.confirm(
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
    <>
      <div className="admin-products-page">

        <h1>
          Product Management 
        </h1>

        <p className="sub-text">
          Manage store inventory and marketplace listings.
        </p>

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={saveProduct}
          className="product-form"
        >
          <input
            className="premium-input"
            placeholder="Product Name"
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
            className="premium-input"
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
            className="premium-input"
            placeholder="Stock Left"
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
            className="premium-input"
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
            className="premium-input"
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
            className="premium-input premium-textarea"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
          />

          <div className="button-row">

            <button className="primary-btn">
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}

          </div>
        </form>

        {/* PRODUCTS */}

        <h2 className="products-heading">
          Products Available ({products.length})
        </h2>

        <div className="products-grid">

          {products.length === 0 ? (
            <div className="empty-box">
              No products found 📦
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="product-card"
              >
                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  className="product-image"
                />

                <div className="product-content">

                  <h3>
                    {product.name}
                  </h3>

                  <p className="category">
                    {product.category ||
                      "Uncategorized"}
                  </p>

                  <p className="price">
                    ₹ {product.price}
                  </p>

                  <span
                    className={
                      product.stock > 0
                        ? "stock-green"
                        : "stock-red"
                    }
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of Stock"}
                  </span>

                  <div className="card-buttons">

                    <button
                      onClick={() =>
                        editProduct(
                          product
                        )
                      }
                      className="edit-btn"
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(
                          product._id
                        )
                      }
                      className="delete-btn"
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>
              </div>
            ))
          )}

        </div>
      </div>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .admin-products-page{
        min-height:100vh;
        padding:50px;

        background:
        linear-gradient(
          to right,
          #0f172a,
          #1e3a8a
        );
      }

      h1{
        color:white;
        font-size:42px;
        margin-bottom:10px;
      }

      .sub-text{
        color:#cbd5e1;
        margin-bottom:35px;
        font-size:17px;
      }

      .message-box{
        background:
        rgba(34,197,94,.2);

        padding:14px;
        border-radius:14px;
        color:white;
        margin-bottom:25px;
      }

      .product-form{
        background:
        rgba(255,255,255,0.12);

        backdrop-filter:
        blur(18px);

        border:
        1px solid rgba(
          255,255,255,0.18
        );

        border-radius:24px;

        padding:28px;

        display:grid;
        gap:14px;

        margin-bottom:55px;

        box-shadow:
        0 10px 30px rgba(
          0,0,0,.25
        );
      }

      .premium-input{
        width:100%;
        padding:15px;

        border:none;
        outline:none;

        border-radius:14px;

        background:
        rgba(255,255,255,0.12);

        color:white;

        border:
        1px solid rgba(
          255,255,255,0.12
        );

        font-size:15px;

        transition:.3s ease;
      }

      .premium-input::placeholder{
        color:#cbd5e1;
      }

      .premium-input:focus{
        border:
        1px solid #3b82f6;

        box-shadow:
        0 0 18px rgba(
          59,130,246,.2
        );
      }

      .premium-textarea{
        min-height:100px;
      }

      .button-row{
        display:flex;
        gap:14px;
        margin-top:8px;
      }

      .primary-btn,
      .cancel-btn{
        border:none;
        cursor:pointer;
        padding:14px 20px;
        border-radius:14px;
        color:white;
        font-weight:700;
        transition:.3s;
      }

      .primary-btn{
        background:#2563eb;
      }

      .primary-btn:hover{
        transform:
        translateY(-2px);
      }

      .cancel-btn{
        background:#64748b;
      }

      .products-heading{
        color:white;
        margin-bottom:25px;
        font-size:28px;
      }

      .products-grid{
        display:grid;

        grid-template-columns:
        repeat(auto-fit,minmax(260px,1fr));

        gap:22px;
      }

      .product-card{
        background:
        rgba(255,255,255,0.12);

        backdrop-filter:
        blur(18px);

        border:
        1px solid rgba(
          255,255,255,0.15
        );

        border-radius:22px;

        overflow:hidden;

        color:white;

        transition:.35s ease;
      }

      .product-card:hover{
        transform:
        translateY(-5px);

        box-shadow:
        0 12px 30px rgba(
          37,99,235,.25
        );
      }

      .product-image{
        width:100%;
        height:220px;
        object-fit:contain;
        background:white;
        padding:18px;
      }

      .product-content{
        padding:18px;
      }

      .product-content h3{
        margin:0 0 10px 0;
      }

      .category{
        color:#cbd5e1;
        margin-bottom:12px;
      }

      .price{
        font-size:24px;
        color:#60a5fa;
        font-weight:bold;
      }

      .stock-green,
      .stock-red{
        display:inline-block;
        padding:8px 12px;
        border-radius:999px;
        font-size:13px;
        margin-bottom:16px;
      }

      .stock-green{
        background:#16a34a;
      }

      .stock-red{
        background:#dc2626;
      }

      .card-buttons{
        display:flex;
        gap:10px;
      }

      .edit-btn,
      .delete-btn{
        border:none;
        cursor:pointer;
        padding:10px 12px;
        border-radius:12px;
        color:white;
        font-weight:bold;
        transition:.3s;
      }

      .edit-btn{
        background:#2563eb;
      }

      .delete-btn{
        background:#ef4444;
      }

      .edit-btn:hover,
      .delete-btn:hover{
        transform:
        translateY(-2px);
      }

      .empty-box{
        color:white;
        padding:25px;
      }

      @media(max-width:768px){
        .admin-products-page{
          padding:30px 20px;
        }
      }

      `}</style>
    </>
  );
}