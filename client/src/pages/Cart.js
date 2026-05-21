import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function Cart({
  cart,
  setCart,
  user,
}) {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  // BUY NOW LOGIC
  const queryParams =
    new URLSearchParams(
      location.search
    );

  const isBuyNow =
    queryParams.get(
      "buyNow"
    ) === "true";

  const buyNowProduct =
    JSON.parse(
      localStorage.getItem(
        "buyNowProduct"
      )
    );

  const finalCart =
    isBuyNow &&
    buyNowProduct
      ? [buyNowProduct]
      : cart;

  // TOTAL
  const total =
    finalCart.reduce(
      (acc, item) =>
        acc + item.price,
      0
    );

  // REMOVE ITEM
  const removeFromCart = (
    index
  ) => {
    const updatedCart =
      cart.filter(
        (_, i) => i !== index
      );

    setCart(updatedCart);
  };

  // CHECKOUT
  const handleCheckout =
    async () => {
      if (!user) {
        alert(
          "Please login first"
        );

        navigate("/login");

        return;
      }

      const options = {
        key: "rzp_test_Sc5yEFzMokiaFH",

        amount: total * 100,

        currency: "INR",

        name: "Ecart",

        description:
          "Order Payment",

        handler:
          async function (
            response
          ) {
            const orderData =
              {
                userId:
                  user._id,

                items:
                  finalCart,

                totalAmount:
                  total,

                paymentId:
                  response.razorpay_payment_id,
              };

            await fetch(
              "http://localhost:5000/api/orders",
              {
                method:
                  "POST",

                headers:
                  {
                    "Content-Type":
                      "application/json",
                  },

                body: JSON.stringify(
                  orderData
                ),
              }
            );

            // CLEAR NORMAL CART
            if (
              !isBuyNow
            ) {
              setCart([]);
            }

            // CLEAR BUY NOW PRODUCT
            localStorage.removeItem(
              "buyNowProduct"
            );

            navigate(
              "/orders"
            );
          },

        theme: {
          color:
            "#2563eb",
        },
      };

      const razor =
        new window.Razorpay(
          options
        );

      razor.open();
    };

  return (
    <div
      style={{
        padding: "30px",
        background:
          "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom:
            "30px",
        }}
      >
        Shopping Cart 🛒
      </h1>

      {/* EMPTY CART */}
      {finalCart.length ===
        0 && (
        <h2>
          Your cart is empty
        </h2>
      )}

      {/* CART ITEMS */}
      {finalCart.map(
        (item, index) => (
          <div
            key={index}
            style={{
              background:
                "white",
              padding:
                "20px",
              borderRadius:
                "20px",
              marginBottom:
                "20px",
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display:
                  "flex",
                gap: "20px",
                alignItems:
                  "center",
              }}
            >
              <img
                src={
                  item.image
                }
                alt={
                  item.name
                }
                style={{
                  width:
                    "120px",
                  height:
                    "120px",
                  objectFit:
                    "cover",
                  borderRadius:
                    "12px",
                }}
              />

              <div>
                <h2>
                  {
                    item.name
                  }
                </h2>

                <p
                  style={{
                    color:
                      "#6b7280",
                  }}
                >
                  {
                    item.description
                  }
                </p>

                <h2
                  style={{
                    color:
                      "#2563eb",
                  }}
                >
                  ₹
                  {
                    item.price
                  }
                </h2>
              </div>
            </div>

            {/* REMOVE BUTTON */}
            {!isBuyNow && (
              <button
                onClick={() =>
                  removeFromCart(
                    index
                  )
                }
                style={{
                  background:
                    "#ef4444",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "12px 18px",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                }}
              >
                Remove
              </button>
            )}
          </div>
        )
      )}

      {/* TOTAL */}
      {finalCart.length >
        0 && (
        <div
          style={{
            background:
              "white",
            padding:
              "30px",
            borderRadius:
              "20px",
            marginTop:
              "30px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h1>
            Total: ₹
            {total}
          </h1>

          <button
            onClick={
              handleCheckout
            }
            style={{
              marginTop:
                "20px",
              width:
                "100%",
              padding:
                "15px",
              background:
                "#2563eb",
              color:
                "white",
              border:
                "none",
              borderRadius:
                "12px",
              fontSize:
                "18px",
              fontWeight:
                "bold",
              cursor:
                "pointer",
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}