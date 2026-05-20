export default function Cart({ user, cart, setCart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = async () => {
    if (!user) {
      alert("Login first");
      return;
    }
    if (cart.length === 0) {
      alert("Cart empty");
      return;
    }

    const orderRes = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total * 100 }),
    });

    const orderData = await orderRes.json();

    const options = {
      key: "rzp_test_Sc5yEFzMokiaFH",
      amount: orderData.amount,
      currency: "INR",
      order_id: orderData.id,
      handler: async (response) => {
        await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            products: cart,
            total,
            paymentId: response.razorpay_payment_id,
          }),
        });

        alert("Order placed!");
        setCart([]);
      },
    };

    new window.Razorpay(options).open();
  };

  if (!user) return <h2>Please login</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cart</h2>

      {cart.map((item, index) => (
        <div key={index}>
          {item.name} — ₹{item.price}
          <button onClick={() => setCart(cart.filter((_, i) => i !== index))}>
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}