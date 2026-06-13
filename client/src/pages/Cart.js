import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const steps = [
  "Address",
  "Summary",
  "Payment",
];

const emptyAddress = {
  fullName: "",
  phone: "",
  pincode: "",
  city: "",
  state: "",
  houseNo: "",
  roadName: "",
};

export default function Cart({
  cart,
  setCart,
  user,
}) {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    address,
    setAddress,
  ] = useState(
    emptyAddress
  );

  const [
    savedAddresses,
    setSavedAddresses,
  ] = useState([]);

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState(null);

  const [
    step,
    setStep,
  ] = useState(1);

  const [
    savedOrder,
    setSavedOrder,
  ] = useState(null);

  const [
    checkoutError,
    setCheckoutError,
  ] = useState("");

  const queryParams =
    new URLSearchParams(
      location.search
    );

  const isBuyNow =
    queryParams.get(
      "buyNow"
    ) === "true";

  const [
    showCheckout,
    setShowCheckout,
  ] = useState(
    isBuyNow
  );

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

  const groupedCart =
    finalCart.reduce(
      (
        acc,
        item
      ) => {
        const existing =
          acc.find(
            (x) =>
              x._id ===
              item._id
          );

        if (
          existing
        ) {
          existing.quantity +=
            1;
        } else {
          acc.push({
            ...item,
            quantity: 1,
          });
        }

        return acc;
      },
      []
    );

  const total =
    groupedCart.reduce(
      (
        acc,
        item
      ) =>
        acc +
        item.price *
          item.quantity,
      0
    );

  useEffect(() => {
    const fetchAddresses =
      async () => {
        if (!user) return;

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            "http://localhost:5000/api/addresses",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        if (
          Array.isArray(
            data
          )
        ) {
          setSavedAddresses(
            data
          );
        }
      };

    fetchAddresses();
  }, [user]);

  const updateAddress =
    (
      name,
      value
    ) => {
      setAddress({
        ...address,
        [name]:
          value,
      });

      setCheckoutError(
        ""
      );
    };

  const selectSavedAddress =
    (addr) => {
      setSelectedAddressId(
        addr._id
      );

      setAddress({
        fullName:
          addr.fullName ||
          "",
        phone:
          addr.phone || "",
        pincode:
          addr.pincode ||
          "",
        city:
          addr.city || "",
        state:
          addr.state ||
          "",
        houseNo:
          addr.addressLine1 ||
          "",
        roadName:
          addr.addressLine2 ||
          "",
      });
    };
      const addOne =
    (product) => {
      if (
        product.quantity >=
        product.stock
      ) {
        alert(
          "No stock left"
        );
        return;
      }

      setCart([
        ...cart,
        product,
      ]);
    };

  const removeOne =
    (id) => {
      const index =
        cart.findIndex(
          (x) =>
            x._id === id
        );

      if (
        index === -1
      )
        return;

      setCart(
        cart.filter(
          (_, i) =>
            i !== index
        )
      );
    };

  const removeProduct =
    (id) => {
      setCart(
        cart.filter(
          (item) =>
            item._id !== id
        )
      );
    };

  const validateAddress =
    () => {
      const required =
        [
          "fullName",
          "phone",
          "pincode",
          "city",
          "state",
          "houseNo",
          "roadName",
        ];

      const missing =
        required.find(
          (field) =>
            !String(
              address[
                field
              ] || ""
            ).trim()
        );

      if (
        missing
      ) {
        setCheckoutError(
          "Please fill all required fields."
        );
        return false;
      }

      return true;
    };

  const validateStock =
    () => {
      const invalid =
        groupedCart.find(
          (item) =>
            item.quantity >
            item.stock
        );

      if (
        invalid
      ) {
        alert(
          `${invalid.name} only has ${invalid.stock} left`
        );
        return false;
      }

      return true;
    };

  const startCheckout =
    () => {
      if (!user) {
        alert(
          "Please login first"
        );

        navigate(
          "/login"
        );

        return;
      }

      if (
        !validateStock()
      )
        return;

      setShowCheckout(
        true
      );

      setStep(1);
    };

  const goToSummary =
    () => {
      if (
        !validateAddress()
      )
        return;

      setStep(2);
    };

  const processPayment =
    async () => {
      if (
        !validateStock()
      )
        return;

      const options = {
        key: "rzp_test_Sc5yEFzMokiaFH",

        amount:
          total * 100,

        currency:
          "INR",

        name:
          "ECART",

        description:
          "Order Payment",

        handler:
          async (
            response
          ) => {
            const orderData =
              {
                userId:
                  user._id,

                items:
                  groupedCart.map(
                    (
                      item
                    ) => ({
                      productId:
                        item._id,

                      name:
                        item.name,

                      price:
                        item.price,

                      image:
                        item.image,

                      quantity:
                        item.quantity,
                    })
                  ),

                totalAmount:
                  total,

                paymentId:
                  response.razorpay_payment_id,

                shippingAddress:
                  address,
              };

            const res =
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

                  body:
                    JSON.stringify(
                      orderData
                    ),
                }
              );

            const saved =
              await res.json();

            if (
              !res.ok
            ) {
              alert(
                saved.message ||
                  "Order failed"
              );
              return;
            }

            if (
              !isBuyNow
            ) {
              setCart([]);
            }

            localStorage.removeItem(
              "buyNowProduct"
            );

            setSavedOrder(
              saved
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
    <>
      {savedOrder && (
        <div className="success-page">

          <div className="success-card">

            <div className="success-icon">
              ✓
            </div>

            <h1>
              Order Successful
            </h1>

            <p>
              Payment completed successfully
            </p>

            <p>
              Order ID:
              <strong>
                {" "}
                {savedOrder._id}
              </strong>
            </p>

            <button
              onClick={() =>
                navigate(
                  "/orders"
                )
              }
              className="main-btn"
            >
              View Orders
            </button>

          </div>

        </div>
      )}

      {!savedOrder &&
        !showCheckout && (
          <div className="cart-page">

            <div className="page-header">

              <h1>
                Shopping Cart 🛒
              </h1>

              <button
                onClick={() =>
                  navigate("/")
                }
                className="text-btn"
              >
                Continue Shopping
              </button>

            </div>

            {groupedCart.length ===
              0 && (
              <div className="empty-card">

                <h2>
                  Your Cart Is Empty
                </h2>

                <p>
                  Add products before checkout
                </p>

              </div>
            )}

            {groupedCart.length >
              0 && (
              <div className="cart-layout">

                <div className="glass-card">

                  <h2>
                    Cart Items
                  </h2>

                  {groupedCart.map(
                    (
                      item
                    ) => (
                      <div
                        key={
                          item._id
                        }
                        className="cart-product-row"
                      >

                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          className="cart-product-img"
                        />

                        <div className="item-info">

                          <h3>
                            {
                              item.name
                            }
                          </h3>

                          <p>
                            Rs{" "}
                            {
                              item.price
                            }
                          </p>

                        </div>

                        <div className="qty-box">

                          <button
                            onClick={() =>
                              removeOne(
                                item._id
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            onClick={() =>
                              addOne(
                                item
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                        <button
                          onClick={() =>
                            removeProduct(
                              item._id
                            )
                          }
                          className="remove-btn"
                        >
                          Remove
                        </button>

                      </div>
                    )
                  )}

                </div>

                <div className="cart-summary-card">

                  <h2>
                    Order Summary
                  </h2>

                  <div className="summary-row">

                    <span>
                      Items
                    </span>

                    <span>
                      {
                        cart.length
                      }
                    </span>

                  </div>

                  <div className="summary-row">

                    <span>
                      Total
                    </span>

                    <strong>
                      Rs {total}
                    </strong>

                  </div>

                  <button
                    onClick={
                      startCheckout
                    }
                    className="main-btn"
                  >
                    Proceed To Checkout
                  </button>

                </div>

              </div>
            )}

          </div>
      )}

      {!savedOrder &&
        showCheckout && (
        <div className="checkout-page">

          <div className="page-header">

            <button
              onClick={() =>
                step === 1
                  ? setShowCheckout(
                      false
                    )
                  : setStep(
                      step - 1
                    )
              }
              className="back-btn"
            >
              ←
            </button>

            <h2>
              Secure Checkout
            </h2>

          </div>

          <div className="stepper">

            {steps.map(
              (
                label,
                index
              ) => (
                <div
                  key={label}
                  className="step-item"
                >

                  <div
                    className={
                      step >=
                      index + 1
                        ? "step-circle active"
                        : "step-circle"
                    }
                  >
                    {index + 1}
                  </div>

                  <span>
                    {label}
                  </span>

                </div>
              )
            )}

          </div>

          {step === 1 && (
            <div className="glass-card checkout-card">

              <h2>
                Delivery Address
              </h2>

              {savedAddresses.length > 0 && (
                <div className="saved-address-list">

                  <h3>
                    Saved Addresses
                  </h3>

                  {savedAddresses.map(
                    (addr) => (
                      <div
                        key={
                          addr._id
                        }
                        onClick={() =>
                          selectSavedAddress(
                            addr
                          )
                        }
                        className={
                          selectedAddressId ===
                          addr._id
                            ? "address-card active-address"
                            : "address-card"
                        }
                      >

                        <strong>
                          {
                            addr.fullName
                          }
                        </strong>

                        <p>
                          {
                            addr.addressLine1
                          },{" "}
                          {
                            addr.city
                          },{" "}
                          {
                            addr.state
                          }
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}

              {checkoutError && (
                <div className="error-box">
                  {checkoutError}
                </div>
              )}

              <div className="form-grid">
                                <input
                  placeholder="Full Name"
                  value={address.fullName}
                  onChange={(e) =>
                    updateAddress(
                      "fullName",
                      e.target.value
                    )
                  }
                  className="premium-input"
                />

                <input
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    updateAddress(
                      "phone",
                      e.target.value
                    )
                  }
                  className="premium-input"
                />

                <input
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    updateAddress(
                      "pincode",
                      e.target.value
                    )
                  }
                  className="premium-input"
                />

                <input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    updateAddress(
                      "city",
                      e.target.value
                    )
                  }
                  className="premium-input"
                />

                <input
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    updateAddress(
                      "state",
                      e.target.value
                    )
                  }
                  className="premium-input"
                />

                <input
                  placeholder="House No"
                  value={address.houseNo}
                  onChange={(e) =>
                    updateAddress(
                      "houseNo",
                      e.target.value
                    )
                  }
                  className="premium-input"
                />

                <input
                  placeholder="Road / Area"
                  value={address.roadName}
                  onChange={(e) =>
                    updateAddress(
                      "roadName",
                      e.target.value
                    )
                  }
                  className="premium-input"
                />

                <button
                  onClick={
                    goToSummary
                  }
                  className="main-btn"
                >
                  Continue
                </button>

              </div>

            </div>
          )}

          {step === 2 && (
            <div className="glass-card checkout-card">

              <h2>
                Order Summary
              </h2>

              {groupedCart.map(
                (item) => (
                  <div
                    key={
                      item._id
                    }
                    className="summary-row"
                  >
                    <span>
                      {item.name} ×{" "}
                      {
                        item.quantity
                      }
                    </span>

                    <strong>
                      Rs{" "}
                      {item.price *
                        item.quantity}
                    </strong>
                  </div>
                )
              )}

              <div className="summary-row total-row">

                <span>
                  Final Amount
                </span>

                <strong>
                  Rs {total}
                </strong>

              </div>

              <button
                onClick={() =>
                  setStep(3)
                }
                className="main-btn"
              >
                Continue To Payment
              </button>

            </div>
          )}

          {step === 3 && (
            <div className="glass-card checkout-card">

              <h2>
                Razorpay Payment 💳
              </h2>

              <p>
                Secure payment gateway
              </p>

              <div className="summary-row total-row">

                <span>
                  Amount
                </span>

                <strong>
                  Rs {total}
                </strong>

              </div>

              <button
                onClick={
                  processPayment
                }
                className="pay-btn"
              >
                Pay Now
              </button>

            </div>
          )}

        </div>
      )}

<style>{`

*{
box-sizing:border-box;
}

.cart-page,
.checkout-page,
.success-page{
min-height:100vh;
padding:32px;
background:
linear-gradient(
to right,
#0f172a,
#1e3a8a
);
}

.page-header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:28px;
color:white;
gap:12px;
}

.page-header h1,
.page-header h2{
margin:0;
color:white;
}

.glass-card,
.cart-summary-card,
.empty-card,
.success-card{
background:
rgba(255,255,255,.12);
backdrop-filter:
blur(16px);
border:
1px solid rgba(255,255,255,.15);
border-radius:24px;
padding:24px;
color:white;
box-shadow:
0 8px 24px rgba(0,0,0,.22);

transition:
all .28s ease;
}

.glass-card:hover,
.cart-summary-card:hover,
.success-card:hover{
transform:
translateY(-4px);
box-shadow:
0 14px 30px rgba(
37,99,235,.22
);
}

.cart-layout{
display:grid;
grid-template-columns:
2fr 1fr;
gap:24px;
align-items:start;
}

.cart-summary-card{
height:fit-content;
position:sticky;
top:20px;
}

.cart-product-row{
display:grid;
grid-template-columns:
100px minmax(180px,1fr) 120px 100px;
gap:18px;
align-items:center;
padding:16px 0;
border-bottom:
1px solid rgba(255,255,255,.08);
min-height:120px;
}

.cart-product-img{
width:90px;
height:90px;
object-fit:contain;
background:white;
padding:8px;
border-radius:12px;
transition:
transform .25s ease;
}

.cart-product-row:hover .cart-product-img{
transform:scale(1.05);
}

.item-info{
display:flex;
flex-direction:column;
gap:6px;
}

.item-info h3{
margin:0;
}

.item-info p{
margin:0;
color:#cbd5e1;
}

.qty-box{
display:flex;
gap:10px;
align-items:center;
justify-content:center;
}

.qty-box button{
width:34px;
height:34px;
border:none;
border-radius:50%;
cursor:pointer;
font-weight:bold;
}

.remove-btn{
background:#dc2626;
color:white;
border:none;
padding:10px 14px;
border-radius:10px;
cursor:pointer;
}

.summary-row{
display:flex;
justify-content:space-between;
padding:14px 0;
border-bottom:
1px solid rgba(255,255,255,.08);
}

.total-row{
font-size:18px;
font-weight:bold;
}

.main-btn,
.pay-btn{
width:100%;
margin-top:18px;
padding:14px;
border:none;
border-radius:14px;
cursor:pointer;
font-weight:700;
color:white;
background:
linear-gradient(
135deg,
#2563eb,
#1d4ed8
);

transition:
all .25s ease;
position:relative;
overflow:hidden;
}

.main-btn:hover,
.pay-btn:hover{
transform:
translateY(-3px);
box-shadow:
0 10px 24px rgba(
59,130,246,.35
);
}

.main-btn:active,
.pay-btn:active{
transform:scale(.98);
}

.pay-btn{
background:
linear-gradient(
135deg,
#16a34a,
#15803d
);
}

.text-btn,
.back-btn{
background:none;
border:none;
cursor:pointer;
color:#60a5fa;
font-weight:bold;
font-size:16px;
}

.stepper{
display:flex;
justify-content:center;
gap:26px;
margin-bottom:24px;
flex-wrap:wrap;
}

.step-item{
display:flex;
flex-direction:column;
align-items:center;
gap:8px;
color:white;
}

.step-circle{
width:34px;
height:34px;
border-radius:50%;
display:grid;
place-items:center;
border:1px solid white;
transition:
all .25s ease;
}

.step-circle.active{
background:#2563eb;
border:none;

transform:
scale(1.08);

box-shadow:
0 0 18px rgba(
59,130,246,.35
);
}

.checkout-card{
max-width:850px;
margin:auto;
}

.form-grid{
display:grid;
gap:14px;
}

.premium-input{
width:100%;
padding:15px;
border:none;
outline:none;
border-radius:14px;
background:
rgba(255,255,255,.14);
color:white;
border:
1px solid rgba(255,255,255,.12);
}

.premium-input::placeholder{
color:#cbd5e1;
}

.saved-address-list{
display:grid;
gap:12px;
margin-bottom:20px;
}

.address-card{
padding:14px;
border-radius:14px;
background:
rgba(255,255,255,.08);
border:
1px solid rgba(255,255,255,.12);
cursor:pointer;

transition:
all .25s ease;
}

.address-card:hover{
transform:
translateY(-3px);
box-shadow:
0 8px 18px rgba(
255,255,255,.08
);
}

.active-address{
border:
1px solid #3b82f6;
box-shadow:
0 0 14px rgba(
59,130,246,.3
);
}

.error-box{
background:
rgba(239,68,68,.18);
padding:12px;
border-radius:12px;
margin-bottom:14px;
color:#fecaca;
}

.success-page{
display:flex;
justify-content:center;
align-items:center;
}

.success-card{
width:500px;
text-align:center;
}

.success-icon{
width:70px;
height:70px;
border-radius:50%;
background:#16a34a;
display:grid;
place-items:center;
font-size:38px;
margin:0 auto 18px;
}

@media(max-width:768px){

.cart-layout{
grid-template-columns:1fr;
}

.cart-summary-card{
position:static;
}

.cart-product-row{
grid-template-columns:1fr;
text-align:center;
min-height:auto;
transition:
all .25s ease;
border-radius:14px;
padding-left:10px;
padding-right:10px;
}

.cart-product-row:hover{
background:
rgba(255,255,255,.05);

transform:
translateX(4px);
}

.cart-product-img{
margin:auto;
}

.page-header{
flex-direction:column;
align-items:flex-start;
}

}

`}</style>

    </>
  );
}