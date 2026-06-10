import {
  useCallback,
  useEffect,
  useState,
} from "react";

export default function Orders({ user }) {
  const [orders, setOrders] =
    useState([]);
  const [message, setMessage] =
    useState("");

  const fetchOrders = useCallback(() => {
    fetch(
      "http://localhost:5000/api/orders"
    )
      .then((res) => res.json())
      .then((data) => {
        const userOrders = user
          ? data.filter(
              (order) =>
                order.userId ===
                user._id
            )
          : [];

        setOrders(userOrders);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderAction = async (
    orderId,
    action
  ) => {
    if (!user) {
      setMessage(
        "Please login to update your order."
      );
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/orders/${orderId}/action`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          userId: user._id,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setMessage(
        data.message ||
          "Order update failed"
      );
      return;
    }

    setMessage(
      action === "cancel"
        ? "Order cancelled successfully."
        : "Exchange request submitted."
    );

    fetchOrders();
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>
        My Orders
      </h1>

      {message && (
        <p style={messageStyle}>
          {message}
        </p>
      )}

      {orders.length === 0 && (
        <h2>No Orders Yet</h2>
      )}

      {orders.map((order) => {
        const status =
          order.status || "Pending";

        const canCancel = [
          "Pending",
          "Packed",
        ].includes(status);

        const canExchange = [
          "Pending",
          "Packed",
          "Shipped",
          "Delivered",
        ].includes(status);

        return (
          <div
            key={order._id}
            style={cardStyle}
          >
            <div style={topInfoStyle}>
              <h2 style={priceStyle}>
                Rs {order.totalAmount || 0}
              </h2>

              <h3 style={{ margin: 0 }}>
                Items:{" "}
                {order.items
                  ? order.items.length
                  : 0}
              </h3>

              <p style={strongTextStyle}>
                Payment ID:{" "}
                {order.paymentId}
              </p>

              <p style={statusStyle}>
                Status: {status}
              </p>
            </div>

            <div style={actionRowStyle}>
              {canCancel && (
                <button
                  type="button"
                  style={{
                    ...actionButtonStyle,
                    ...cancelButtonStyle,
                  }}
                  onClick={() =>
                    updateOrderAction(
                      order._id,
                      "cancel"
                    )
                  }
                >
                  Cancel Order
                </button>
              )}

              {canExchange && (
                <button
                  type="button"
                  style={{
                    ...actionButtonStyle,
                    ...exchangeButtonStyle,
                  }}
                  onClick={() =>
                    updateOrderAction(
                      order._id,
                      "exchange"
                    )
                  }
                >
                  Exchange Order
                </button>
              )}
            </div>

            {order.shippingAddress && (
              <div style={addressStyle}>
                <strong>
                  Delivery Address
                </strong>
                <p style={mutedStyle}>
                  {
                    order.shippingAddress
                      .fullName
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      .phone
                  }
                  <br />
                  {order.shippingAddress
                    .houseNo ||
                    order.shippingAddress
                      .addressLine}
                  ,{" "}
                  {
                    order.shippingAddress
                      .roadName
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      .city
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      .state
                  }{" "}
                  -{" "}
                  {
                    order.shippingAddress
                      .pincode
                  }
                </p>
              </div>
            )}

            <div style={productsStyle}>
              {order.items &&
                order.items.map(
                  (item, idx) => (
                    <div
                      key={idx}
                      style={productCardStyle}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={imageStyle}
                      />

                      <h3 style={productTitleStyle}>
                        {item.name}
                      </h3>

                      <p style={productPriceStyle}>
                        Rs {item.price} x{" "}
                        {item.quantity || 1}
                      </p>
                    </div>
                  )
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  background: "#f3f4f6",
  minHeight: "100vh",
};

const titleStyle = {
  marginBottom: "30px",
  fontSize: "42px",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const messageStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontWeight: "bold",
};

const topInfoStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  flexWrap: "wrap",
  gap: "10px",
};

const priceStyle = {
  color: "#2563eb",
  margin: 0,
};

const strongTextStyle = {
  margin: 0,
  fontWeight: "bold",
};

const statusStyle = {
  margin: 0,
  background: "#dcfce7",
  color: "#166534",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: "bold",
};

const actionRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const actionButtonStyle = {
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  padding: "10px 16px",
};

const cancelButtonStyle = {
  background: "#dc2626",
};

const exchangeButtonStyle = {
  background: "#2563eb",
};

const addressStyle = {
  background: "#f8fafc",
  padding: "14px",
  borderRadius: "8px",
  marginBottom: "20px",
};

const mutedStyle = {
  color: "#64748b",
  lineHeight: "1.6",
  marginBottom: 0,
};

const productsStyle = {
  display: "flex",
  gap: "15px",
  overflowX: "auto",
};

const productCardStyle = {
  minWidth: "180px",
  background: "#f9fafb",
  padding: "12px",
  borderRadius: "8px",
};

const imageStyle = {
  width: "100%",
  height: "140px",
  objectFit: "cover",
  borderRadius: "8px",
};

const productTitleStyle = {
  marginTop: "10px",
  marginBottom: "5px",
};

const productPriceStyle = {
  color: "#2563eb",
  fontWeight: "bold",
};
