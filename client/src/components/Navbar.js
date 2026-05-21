import {
  Link,
  useNavigate,
} from "react-router-dom";

export default function Navbar({
  user,
  setUser,
  cart,
  setCart,
}) {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        background: "#0f172a",
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
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "white",
        }}
      >
        <h2 style={{ margin: 0 }}>
          Ecart 🛒
        </h2>
      </Link>

      {/* NAV LINKS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {/* CART */}
        <Link style={linkStyle} to="/cart">
          Cart {cart.length > 0 && `(${cart.length})`}
        </Link>

        {!user ? (
          <>
            {/* LOGIN */}
            <Link style={linkStyle} to="/login">
              Login
            </Link>

            
          </>
        ) : (
          <>
            {/* PROFILE */}
            <Link
              to="/profile"
              style={{
                textDecoration: "none",
                color: "white",
                background: "#1e293b",
                padding: "8px 14px",
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              👤 {user.name}
            </Link>

            {/* LOGOUT */}
            <button
              onClick={() => {
                setUser(null);
                setCart([]);

                localStorage.removeItem("user");

                navigate("/");
              }}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "10px 16px",
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
};