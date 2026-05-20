import { useEffect, useState } from "react";

export default function Home({ user, cart, setCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          fontSize: "32px",
          color: "#111827",
        }}
      >
        Trending Products 🔥
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {products.map((product) => (
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
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                className="product-image"
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
                transition: "0.3s",
              }}
            >
              Add to Cart
            </button>

            {/* HOVER STYLES */}
            <style>
              {`
                .product-card:hover {
                  transform: translateY(-8px);
                  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
                }

                .product-card:hover .product-image {
                  transform: scale(1.05);
                }

                button:hover {
                  opacity: 0.9;
                }
              `}
            </style>
          </div>
        ))}
      </div>
    </div>
  );
}