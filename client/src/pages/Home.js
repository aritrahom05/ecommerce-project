import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

export default function Home({
  user,
  cart,
  setCart,
  wishlist,
  setWishlist,
}) {
  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  const requireLogin = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return false;
    }

    return true;
  };

  const isWishlisted = (productId) =>
    wishlist.some(
      (item) => item._id === productId
    );

  const toggleWishlist = (product) => {
    if (!requireLogin()) return;

    if (isWishlisted(product._id)) {
      setWishlist(
        wishlist.filter(
          (item) =>
            item._id !== product._id
        )
      );
      return;
    }

    setWishlist([
      ...wishlist,
      product,
    ]);
  };

  const addToCart = (product) => {
    if (!requireLogin()) return;

    if (product.stock <= 0) {
      alert(
        "Product is out of stock"
      );
      return;
    }

    const alreadyInCart =
      cart.filter(
        (item) =>
          item._id === product._id
      ).length;

    if (
      alreadyInCart >= product.stock
    ) {
      alert(
        `Only ${product.stock} stock available`
      );
      return;
    }

    setCart([...cart, product]);
  };

  const buyNow = (product) => {
    if (!requireLogin()) return;

    if (product.stock <= 0) {
      alert(
        "Product is out of stock"
      );
      return;
    }

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify(product)
    );

    navigate("/cart?buyNow=true");
  };

  const notifyMe = (product) => {
    if (!requireLogin()) return;

    alert(
      `We will notify you when ${product.name} is back in stock.`
    );
  };

  // FETCH PRODUCTS
  useEffect(() => {
    fetch(
      "http://localhost:5000/api/products"
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) =>
          product.category?.trim()
        )
        .filter(Boolean)
    ),
  ];

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
  };

  // FILTER PRODUCTS
  const filteredProducts =
    products.filter((product) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        [
          product.name,
          product.category,
          product.description,
          String(product.price || ""),
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

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

      {/* SEARCH */}
      <div style={searchWrapStyle}>
        <input
          type="text"
          placeholder="Search by name, category, description, or price..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={searchInputStyle}
        />

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
          style={categorySelectStyle}
        >
          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category === "All"
                  ? "All categories"
                  : category}
              </option>
            )
          )}
        </select>

        {(search ||
          selectedCategory !==
            "All") && (
          <button
            type="button"
            onClick={clearFilters}
            style={clearButtonStyle}
          >
            Clear
          </button>
        )}
      </div>

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
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          {filteredProducts.map(
            (product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() =>
                  navigate(
                    `/product/${product._id}`
                  )
                }
                style={{
                  background:
                    "white",
                  borderRadius:
                    "18px",
                  padding: "20px",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.1)",
                  transition:
                    "all 0.3s ease",
                  cursor: "pointer",
                  position:
                    "relative",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  title={
                    isWishlisted(product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  style={{
                    position:
                      "absolute",
                    top: "16px",
                    right: "16px",
                    width: "42px",
                    height: "42px",
                    borderRadius:
                      "50%",
                    border:
                      "1px solid #e5e7eb",
                    background:
                      "white",
                    color:
                      isWishlisted(
                        product._id
                      )
                        ? "#ef4444"
                        : "#64748b",
                    fontSize: "24px",
                    cursor:
                      "pointer",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.12)",
                    zIndex: 2,
                  }}
                >
                  ♥
                </button>

                {/* IMAGE */}
                <div
                  style={{
                    overflow:
                      "hidden",
                    borderRadius:
                      "12px",
                  }}
                >
                  <img
                    src={
                      product.image ||
                      "https://via.placeholder.com/250x180.png?text=Product"
                    }
                    alt={
                      product.name
                    }
                    className="product-image"
                    style={{
                      width:
                        "100%",
                      height:
                        "220px",
                      objectFit:
                        "cover",
                      transition:
                        "transform 0.3s ease",
                    }}
                  />
                </div>

                {/* INFO */}
                <h3
                  style={{
                    marginTop:
                      "15px",
                    color:
                      "#111827",
                  }}
                >
                  {product.name}
                </h3>

                <p
                  style={{
                    color:
                      "#6b7280",
                    minHeight:
                      "50px",
                  }}
                >
                  {
                    product.description
                  }
                </p>

                <h2
                  style={{
                    color:
                      "#2563eb",
                  }}
                >
                  Rs {product.price}
                </h2>

                <p
                  style={{
                    color:
                      product.stock > 0
                        ? "#16a34a"
                        : "#ef4444",
                    fontWeight:
                      "bold",
                  }}
                >
                  {product.stock > 0
                    ? `${product.stock} left`
                    : "Out of stock"}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "10px",
                    marginTop:
                      "10px",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.stock > 0) {
                        addToCart(product);
                        return;
                      }

                      notifyMe(product);
                    }}
                    style={{
                      padding: "12px",
                      background:
                        product.stock > 0
                          ? "#2563eb"
                          : "#11c12b",
                      color:
                        "white",
                      border: "none",
                      borderRadius:
                        "10px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {product.stock > 0
                      ? "Add to cart"
                      : "Notify Me"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      buyNow(product);
                    }}
                    style={{
                      padding: "12px",
                      background:
                        product.stock > 0
                          ? "#f97316"
                          : "#94a3b8",
                      color:
                        "white",
                      border: "none",
                      borderRadius:
                        "10px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "bold",
                    }}
                    disabled={
                      product.stock <= 0
                    }
                  >
                    Buy Now
                  </button>
                </div>

                {/* HOVER EFFECT */}
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
            )
          )}
        </div>
      )}

      {/* NO PRODUCTS */}
      {!loading &&
        filteredProducts.length ===
          0 && (
          <h2
            style={{
              marginTop: "40px",
              textAlign:
                "center",
              color: "#6b7280",
            }}
          >
            No products found 😢
          </h2>
        )}
    </div>
  );
}

const searchWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "30px",
};

const searchInputStyle = {
  flex: "1 1 260px",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};

const categorySelectStyle = {
  ...searchInputStyle,
  flex: "0 1 220px",
  background: "white",
  cursor: "pointer",
};

const clearButtonStyle = {
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "0 18px",
  minHeight: "52px",
  fontWeight: "bold",
  cursor: "pointer",
};
