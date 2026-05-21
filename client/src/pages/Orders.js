import { useEffect, useState } from "react";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        const userOrders = data.filter(
          (order) => order.userId === user._id
        );

        setOrders(userOrders);
      });
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Please login to view orders</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "#111827",
        }}
      >
        My Orders 📦
      </h1>

      {orders.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2>No orders yet 😢</h2>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  color: "#2563eb",
                }}
              >
                ₹{order.total}
              </h2>

              <p>
                <strong>Items:</strong>{" "}
                {order.products.length}
              </p>

              <p>
                <strong>Payment ID:</strong>{" "}
                {order.paymentId || "Payment Successful"}
              </p>

              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    style={{
                      width: "150px",
                      background: "#f9fafb",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <h4>{product.name}</h4>

                    <p>₹{product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}