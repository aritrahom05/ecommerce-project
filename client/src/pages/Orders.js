import { useEffect, useState } from "react";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) =>
        setOrders(data.filter((o) => o.userId === user._id))
      );
  }, [user]);

  if (!user) return <h2>Please login</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order._id}>
          <p>Total: ₹{order.total}</p>
          <p>Items: {order.products.length}</p>
        </div>
      ))}
    </div>
  );
}