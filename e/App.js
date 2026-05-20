import { useEffect, useState } from react;

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [user, setUser] = useState(null);

   Fetch products on load
  useEffect(() = {
    fetch(httplocalhost5000apiproducts)
      .then((res) = res.json())
      .then((data) = setProducts(data));
  }, []);

   Fetch Orders for logged user
  const fetchOrders = async (userId) = {
    const res = await fetch(httplocalhost5000apiorders);
    const data = await res.json();

    const userOrders = data.filter(
      (order) = order.userId === userId
    );

    setOrders(userOrders);
  };

   Login
  const handleLogin = async () = {
    const res = await fetch(httplocalhost5000apiauthlogin, {
      method POST,
      headers { Content-Type applicationjson },
      body JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.user) {
      setUser(data.user);
      fetchOrders(data.user._id);
    }
  };

   Register
  const handleRegister = async () = {
    await fetch(httplocalhost5000apiauthregister, {
      method POST,
      headers { Content-Type applicationjson },
      body JSON.stringify({
        name Ari,
        email,
        password,
      }),
    });

    alert(Registered successfully);
  };

   Total price
  const total = cart.reduce((sum, item) = sum + item.price, 0);

   Place order
const placeOrder = async () = {
  if (!user) {
    alert(Login first);
    return;
  }
  if (cart.length === 0) {
    alert(Cart is empty);
    return;
  }

   1) Create Razorpay order on server
  const orderRes = await fetch(httplocalhost5000apipaymentcreate-order, {
    method POST,
    headers { Content-Type applicationjson },
    body JSON.stringify({ amount total  100 }),  ₹ to paise
  });
  const orderData = await orderRes.json();

   2) Open Razorpay checkout
  const options = {
    key rzp_test_Sc5yEFzMokiaFH,  use your TEST key id (public)
    amount orderData.amount,
    currency orderData.currency,
    name My E-Commerce,
    description Test Payment,
    order_id orderData.id,
    handler async function (response) {
       3) On success save order in DB
      await fetch(httplocalhost5000apiorders, {
        method POST,
        headers { Content-Type applicationjson },
        body JSON.stringify({
          userId user._id,
          products cart,
          total total,
          paymentId response.razorpay_payment_id,
        }),
      });

      alert(Payment successful & order placed!);
      setCart([]);
      fetchOrders(user._id);
    },
    theme { color #2563eb },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

  return (
    div style={{ padding 20px }}
      h1My E-Commerce Websiteh1

      { AUTH SECTION }
      div style={{ marginBottom 20px }}
        {!user  (
          
            input
              type=email
              placeholder=Email
              value={email}
              onChange={(e) = setEmail(e.target.value)}
            

            input
              type=password
              placeholder=Password
              value={password}
              onChange={(e) = setPassword(e.target.value)}
            

            button onClick={handleRegister}Registerbutton
            button onClick={handleLogin}Loginbutton
          
        )  (
          div
            h2Welcome, {user.name}h2
            button
              onClick={() = {
                setUser(null);
                setOrders([]);
              }}
            
              Logout
            button
          div
        )}
      div

      { CART COUNT }
      {user && h2Cart Items {cart.length}h2}

      { PRODUCTS }
      div style={{ display flex, gap 20px, flexWrap wrap }}
        {products.map((product) = (
          div
            key={product._id}
            style={{
              border 1px solid #ccc,
              padding 15px,
              width 200px,
              borderRadius 10px,
            }}
          
            h3{product.name}h3
            p₹{product.price}p
            p{product.description}p

            button
              onClick={() = {
                if (!user) {
                  alert(Please login first);
                  return;
                }
                setCart([...cart, product]);
              }}
            
              Add to Cart
            button
          div
        ))}
      div

      { CART + CHECKOUT }
      {user && (
        
          h2 style={{ marginTop 30px }}Carth2

          {cart.map((item, index) = (
            div key={index}
              p
                {item.name} — ₹{item.price}
              p
              button
                onClick={() =
                  setCart(cart.filter((_, i) = i !== index))
                }
              
                Remove
              button
            div
          ))}

          h3Total ₹{total}h3

          button onClick={placeOrder}Place Orderbutton
        
      )}

      { ORDERS }
      {user && (
        
          h2 style={{ marginTop 30px }}My Ordersh2

          {orders.length === 0  (
            pNo orders yetp
          )  (
            orders.map((order) = (
              div
                key={order._id}
                style={{
                  border 1px solid #aaa,
                  padding 10px,
                  marginBottom 10px,
                }}
              
                pstrongTotalstrong ₹{order.total}p
                pstrongItemsstrong {order.products.length}p
              div
            ))
          )}
        
      )}
    div
  );
}

export default App;