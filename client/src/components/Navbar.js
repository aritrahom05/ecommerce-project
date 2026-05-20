import { Link } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  return (
    <nav
      style={{
        background: "#111827",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* LOGO */}
      <h2 style={{ margin: 0 }}>Ecart 🛒</h2>

      {/* LINKS */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link style={linkStyle} to="/">
          Home
        </Link>

        <Link style={linkStyle} to="/cart">
          Cart
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
            <span>Hi, {user.name}</span>

            <button
              onClick={() => setUser(null)}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
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
};