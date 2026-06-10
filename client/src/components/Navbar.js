import catrIcon from "./Cart_logo.png";
import {
  Link,
  useNavigate,
} from "react-router-dom";

export default function Navbar({
  user,
  setUser,
  cart,
  setCart,
  wishlist,
  setWishlist,
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
        {user && (
          <>
            <Link style={linkStyle} to="/wishlist">
              Wishlist{" "}
              {wishlist.length > 0 &&
                `(${wishlist.length})`}
            </Link>

            <Link style={linkStyle} to="/cart">
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <img
                  src={catrIcon}
                  alt="Cart"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />

                {cart.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-8px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      minWidth: "18px",
                      height: "18px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2px",
                    }}
                  >
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
          </>
        )}

        {!user ? (
          <>
            {/* LOGIN */}
            <Link style={linkStyle} to="/login">
              Login
            </Link>

            
          </>
        ) : (
          <>
            {/* ADMIN */}
            {user.isAdmin && (
              <Link
                to="/admin"
                style={linkStyle}
              >
                Admin
              </Link>
            )}

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
                setWishlist([]);

                localStorage.removeItem("user");
                localStorage.removeItem("token");

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
