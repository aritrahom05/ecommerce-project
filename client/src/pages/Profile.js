import { Link } from "react-router-dom";

export default function Profile({
  user,
  cart,
  orders,
}) {
  if (!user) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Please login first</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      {/* PROFILE CARD */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* TOP SECTION */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* AVATAR */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: "bold",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* USER INFO */}
          <div>
            <h1
              style={{
                margin: 0,
                color: "#111827",
              }}
            >
              {user.name}
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              {user.email}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* ORDERS */}
          <div
            style={cardStyle}
          >
            <h2>{orders.length}</h2>
            <p>Total Orders</p>
          </div>

          {/* CART */}
          <div
            style={cardStyle}
          >
            <h2>{cart.length}</h2>
            <p>Cart Items</p>
          </div>

          {/* ACCOUNT STATUS */}
          <div
            style={cardStyle}
          >
            <h2>Active</h2>
            <p>Account Status</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/orders"
            style={buttonStyle}
          >
            View Orders
          </Link>

          <Link
            to="/cart"
            style={buttonStyle}
          >
            Go to Cart
          </Link>

          <Link
            to="/"
            style={buttonStyle}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#eff6ff",
  borderRadius: "15px",
  padding: "25px",
  textAlign: "center",
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  textDecoration: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  fontWeight: "bold",
};