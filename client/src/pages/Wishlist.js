import {
  Navigate,
  useNavigate,
} from "react-router-dom";

export default function Wishlist({
  user,
  wishlist,
  setWishlist,
  cart,
  setCart,
}) {
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const removeFromWishlist = (
    productId
  ) => {
    setWishlist(
      wishlist.filter(
        (item) => item._id !== productId
      )
    );
  };

  const addToCart = (product) => {
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

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>
        My Wishlist
      </h1>

      {wishlist.length === 0 && (
        <div style={emptyStyle}>
          <h2>Your wishlist is empty</h2>
          <p style={mutedStyle}>
            Save products you like and buy them later.
          </p>
          <button
            onClick={() =>
              navigate("/")
            }
            style={primaryButton}
          >
            Browse Products
          </button>
        </div>
      )}

      <div style={gridStyle}>
        {wishlist.map((product) => (
          <div
            key={product._id}
            style={cardStyle}
          >
            <button
              onClick={() =>
                removeFromWishlist(
                  product._id
                )
              }
              title="Remove from wishlist"
              style={heartButton}
            >
              ♥
            </button>

            <img
              src={
                product.image ||
                "https://via.placeholder.com/250x180.png?text=Product"
              }
              alt={product.name}
              style={imageStyle}
            />

            <h2 style={nameStyle}>
              {product.name}
            </h2>
            <p style={mutedStyle}>
              {product.description}
            </p>
            <h2 style={priceStyle}>
              Rs {product.price}
            </h2>
            <p
              style={{
                color:
                  product.stock > 0
                    ? "#16a34a"
                    : "#ef4444",
                fontWeight: "bold",
              }}
            >
              {product.stock > 0
                ? `${product.stock} left`
                : "Out of stock"}
            </p>

            <div style={actionRowStyle}>
              <button
                onClick={() =>
                  addToCart(product)
                }
                style={primaryButton}
                disabled={
                  product.stock <= 0
                }
              >
                Add
              </button>

              <button
                onClick={() =>
                  buyNow(product)
                }
                style={buyButton}
                disabled={
                  product.stock <= 0
                }
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  background: "#f3f4f6",
  minHeight: "100vh",
};

const titleStyle = {
  marginBottom: "24px",
  color: "#111827",
};

const emptyStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "32px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "25px",
};

const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  position: "relative",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const heartButton = {
  position: "absolute",
  top: "16px",
  right: "16px",
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  border: "1px solid #e5e7eb",
  background: "white",
  color: "#ef4444",
  fontSize: "24px",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "8px",
};

const nameStyle = {
  color: "#111827",
};

const mutedStyle = {
  color: "#64748b",
};

const priceStyle = {
  color: "#2563eb",
};

const actionRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginTop: "12px",
};

const primaryButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px",
  fontWeight: "bold",
  cursor: "pointer",
};

const buyButton = {
  ...primaryButton,
  background: "#f97316",
};
