import { useEffect, useState } from "react";

export default function Home({ user, cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH PRODUCTS
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  // FILTER PRODUCTS
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "30px",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          marginBottom: "20px",
          fontSize: "32px",
          color: "#111827",
        }}
      >
        Trending Products 🔥
      </h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          marginBottom: "30px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      {/* LOADING */}
      {loading && (
        <h2
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Loading products...
        </h2>
      )}

      {/* PRODUCT GRID */}
      {!loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="product-card"
              style={{
                background: "white",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            >
              {/* IMAGE */}
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/250x180.png?text=Product"
                  }
                  alt={product.name}
                  className="product-image"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>

              {/* INFO */}
              <h3
                style={{
                  marginTop: "15px",
                  color: "#111827",
                }}
              >
                {product.name}
              </h3>

              <p
                style={{
                  color: "#6b7280",
                  minHeight: "50px",
                }}
              >
                {product.description}
              </p>

              <h2
                style={{
                  color: "#2563eb",
                }}
              >
                ₹{product.price}
              </h2>

              {/* BUTTON */}
              <button
                onClick={() => {
                  if (!user) {
                    alert("Please login first");
                    return;
                  }

                  setCart([...cart, product]);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
                Add to Cart
              </button>

              {/* HOVER EFFECTS */}
              <style>
                {`
                  .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
                  }

                  .product-card:hover .product-image {
                    transform: scale(1.05);
                  }
                `}
              </style>
            </div>
          ))}
        </div>
      )}

      {/* NO PRODUCTS FOUND */}
      {!loading && filteredProducts.length === 0 && (
        <h2
          style={{
            marginTop: "40px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          No products found 😢
        </h2>
      )}
    </div>
  );
}