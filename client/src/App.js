import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Fetch products on load
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Fetch Orders for logged user
  const fetchOrders = async (userId) => {
    const res = await fetch("http://localhost:5000/api/orders");
    const data = await res.json();

    const userOrders = data.filter(
      (order) => order.userId === userId
    );

    setOrders(userOrders);
  };

  // Login
  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.user) {
      setUser(data.user);
      fetchOrders(data.user._id);
    }
  };

  // Register
  const handleRegister = async () => {
    await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ari",
        email,
        password,
      }),
    });

    alert("Registered successfully");
  };

  // Total price
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Place order
const placeOrder = async () => {
  if (!user) {
    alert("Login first");
    return;
  }
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  // 1) Create Razorpay order on server
  const orderRes = await fetch("http://localhost:5000/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: total * 100 }), // ₹ to paise
  });
  const orderData = await orderRes.json();

  // 2) Open Razorpay checkout
  const options = {
    key: "rzp_test_Sc5yEFzMokiaFH", // use your TEST key id (public)
    amount: orderData.amount,
    currency: orderData.currency,
    name: "My E-Commerce",
    description: "Test Payment",
    order_id: orderData.id,
    handler: async function (response) {
      // 3) On success: save order in DB
      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          products: cart,
          total: total,
          paymentId: response.razorpay_payment_id,
        }),
      });

      alert("Payment successful & order placed!");
      setCart([]);
      fetchOrders(user._id);
    },
    theme: { color: "#2563eb" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>My E-Commerce Website</h1>

      {/* AUTH SECTION */}
      <div style={{ marginBottom: "20px" }}>
        {!user ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
          </>
        ) : (
          <div>
            <h2>Welcome, {user.name}</h2>
            <button
              onClick={() => {
                setUser(null);
                setOrders([]);
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* CART COUNT */}
      {user && <h2>Cart Items: {cart.length}</h2>}

      {/* PRODUCTS */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              width: "200px",
              borderRadius: "10px",
            }}
          >
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <p>{product.description}</p>

            <button
              onClick={() => {
                if (!user) {
                  alert("Please login first");
                  return;
                }
                setCart([...cart, product]);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART + CHECKOUT */}
      {user && (
        <>
          <h2 style={{ marginTop: "30px" }}>Cart</h2>

          {cart.map((item, index) => (
            <div key={index}>
              <p>
                {item.name} — ₹{item.price}
              </p>
              <button
                onClick={() =>
                  setCart(cart.filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          <button onClick={placeOrder}>Place Order</button>
        </>
      )}

      {/* ORDERS */}
      {user && (
        <>
          <h2 style={{ marginTop: "30px" }}>My Orders</h2>

          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                style={{
                  border: "1px solid #aaa",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <p><strong>Total:</strong> ₹{order.total}</p>
                <p><strong>Items:</strong> {order.products.length}</p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default App;