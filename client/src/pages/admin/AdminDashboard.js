import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Admin Dashboard</h1>

      <div style={gridStyle}>
        <Link to="/admin/products" style={cardStyle}>
          <h2>Products</h2>
          <p>
            Add products, edit price, update stock, and remove old items.
          </p>
        </Link>

        <Link to="/admin/orders" style={cardStyle}>
          <h2>Orders</h2>
          <p>
            View customer addresses, ordered items, payment IDs, and delivery status.
          </p>
        </Link>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f3f4f6",
  padding: "30px",
};

const titleStyle = {
  marginBottom: "24px",
  color: "#111827",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "white",
  color: "#111827",
  textDecoration: "none",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};
