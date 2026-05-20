import { Link } from "react-router-dom";

export default function Navbar({ user, setUser, cart }) {
  return (
    <nav
      style={{
        background: "#111827",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* LOGO */}
      <h2 style={{ margin: 0 }}>AriKart 🛒</h2>

      {/* LINKS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link style={linkStyle} to="/">
          Home
        </Link>

        {/* CART BADGE */}
        <Link style={linkStyle} to="/cart">
          Cart {cart.length > 0 && `(${cart.length})`}
        </Link>

        <Link style={linkStyle} to="/orders">
          Orders
        </Link>

        {!user ? (
          <>
            <Link style={linkStyle} to="/login">
              Login
            </Link>

            <Link style={linkStyle} to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span
              style={{
                background: "#1f2937",
                padding: "8px 12px",
                borderRadius: "20px",
              }}
            >
              Hi, {user.name}
            </span>

            <button
              onClick={() => {
  setUser(null);
  localStorage.removeItem("user");
localStorage.removeItem("cart");
}}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  transition: "0.3s",
};