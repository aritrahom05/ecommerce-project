export default function Cart({ user, cart, setCart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = async () => {
    if (!user) {
      alert("Login first");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const orderRes = await fetch(
      "http://localhost:5000/api/payment/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total * 100 }),
      }
    );

    const orderData = await orderRes.json();

    const options = {
      key: "rzp_test_Sc5yEFzMokiaFH",
      amount: orderData.amount,
      currency: "INR",
      name: "Ecart",
      description: "Ecart Order Payment",
      order_id: orderData.id,

      handler: async function (response) {
        
        await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            products: cart,
            total,
            paymentId:
  response.razorpay_payment_id ||
  "Payment Successful",
          }),
        });

        alert("Payment successful & order placed!");

        setCart([]);
      },

      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!user) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Please login to view cart</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "#111827",
        }}
      >
        Shopping Cart 🛒
      </h1>

      {cart.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Your cart is empty 😢</h2>
        </div>
      ) : (
        <>
          {/* CART ITEMS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {cart.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "15px",
                  padding: "20px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />

                {/* INFO */}
                <div style={{ flex: 1 }}>
                  <h2>{item.name}</h2>

                  <p
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    {item.description}
                  </p>

                  <h3
                    style={{
                      color: "#2563eb",
                    }}
                  >
                    ₹{item.price}
                  </h3>
                </div>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() =>
                    setCart(cart.filter((_, i) => i !== index))
                  }
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL SECTION */}
          <div
            style={{
              marginTop: "30px",
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h2>Total: ₹{total}</h2>

            <button
              onClick={placeOrder}
              style={{
                marginTop: "15px",
                width: "100%",
                padding: "15px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}