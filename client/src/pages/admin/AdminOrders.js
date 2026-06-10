import {
  useEffect,
  useState,
} from "react";

const statuses = [
  "Pending",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Exchange Requested",
];

export default function AdminOrders() {
  const [orders, setOrders] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const token =
    localStorage.getItem("token");

  const fetchOrders = () => {
    fetch(
      "http://localhost:5000/api/orders"
    )
      .then((res) => res.json())
      .then((data) =>
        setOrders(data)
      );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    orderId,
    status
  ) => {
    const res = await fetch(
      `http://localhost:5000/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    if (!res.ok) {
      setMessage(
        "Status update failed. Please login as admin."
      );
      return;
    }

    setMessage("Order status updated");
    fetchOrders();
  };

  return (
    <div style={pageStyle}>
      <h1>Manage Orders</h1>

      {message && (
        <p style={messageStyle}>
          {message}
        </p>
      )}

      <div style={listStyle}>
        {orders.map((order) => (
          <div
            key={order._id}
            style={cardStyle}
          >
            <div style={topRowStyle}>
              <div>
                <h2>
                  Order #{order._id.slice(-6)}
                </h2>
                <p style={mutedStyle}>
                  Payment:{" "}
                  {order.paymentId ||
                    "Not available"}
                </p>
              </div>

              <select
                value={
                  order.status ||
                  "Pending"
                }
                onChange={(e) =>
                  updateStatus(
                    order._id,
                    e.target.value
                  )
                }
                style={selectStyle}
              >
                {statuses.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>

            <div style={sectionStyle}>
              <h3>Customer Address</h3>
              {order.shippingAddress ? (
                <p style={mutedStyle}>
                  {
                    order
                      .shippingAddress
                      .fullName
                  }
                  <br />
                  {
                    order
                      .shippingAddress
                      .phone
                  }
                  <br />
                  {order
                    .shippingAddress
                    .houseNo ||
                    order
                      .shippingAddress
                      .addressLine}
                  ,{" "}
                  {order
                    .shippingAddress
                    .roadName}
                  {order
                    .shippingAddress
                    .landmark
                    ? `, ${order.shippingAddress.landmark}`
                    : ""}
                  ,{" "}
                  {
                    order
                      .shippingAddress
                      .city
                  }
                  ,{" "}
                  {
                    order
                      .shippingAddress
                      .state
                  }{" "}
                  -{" "}
                  {
                    order
                      .shippingAddress
                      .pincode
                  }
                </p>
              ) : (
                <p style={mutedStyle}>
                  No address saved
                </p>
              )}
            </div>

            <div style={sectionStyle}>
              <h3>Products</h3>
              {order.items.map(
                (item, index) => (
                  <div
                    key={index}
                    style={itemRowStyle}
                  >
                    <span>{item.name}</span>
                    <span>
                      Qty {item.quantity || 1}
                    </span>
                    <strong>
                      Rs {item.price}
                    </strong>
                  </div>
                )
              )}
            </div>

            <h2 style={totalStyle}>
              Total: Rs {order.totalAmount}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "30px",
  background: "#f3f4f6",
};

const messageStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "12px",
  borderRadius: "8px",
};

const listStyle = {
  display: "grid",
  gap: "20px",
};

const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const mutedStyle = {
  color: "#64748b",
  lineHeight: "1.6",
};

const selectStyle = {
  height: "42px",
  padding: "0 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const sectionStyle = {
  borderTop: "1px solid #e5e7eb",
  marginTop: "16px",
  paddingTop: "16px",
};

const itemRowStyle = {
  display: "grid",
  gridTemplateColumns:
    "1fr 100px 100px",
  gap: "12px",
  padding: "10px 0",
  borderBottom: "1px solid #f1f5f9",
};

const totalStyle = {
  color: "#2563eb",
};
