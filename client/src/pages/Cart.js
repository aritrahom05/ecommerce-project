import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";

const steps = [
  "Address",
  "Order Summary",
  "Payment",
];

const emptyAddress = {
  fullName: "",
  phone: "",
  alternatePhone: "",
  houseNo: "",
  roadName: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  addressType: "Home",
};

const buildCheckoutAddress = (
  data = {}
) => ({
  fullName:
    data.fullName || "",
  phone: data.phone || "",
  alternatePhone:
    data.alternatePhone || "",
  houseNo:
    data.houseNo ||
    data.addressLine1 ||
    "",
  roadName:
    data.roadName ||
    data.addressLine2 ||
    "",
  landmark:
    data.landmark || "",
  city: data.city || "",
  state: data.state || "",
  pincode:
    data.pincode || "",
  addressType:
    data.addressType ||
    "Home",
});

const buildSavedAddressPayload = (
  address
) => ({
  fullName:
    address.fullName,
  phone: Number(address.phone),
  addressLine1:
    address.houseNo,
  addressLine2:
    address.roadName,
  alternatePhone:
    address.alternatePhone,
  landmark:
    address.landmark,
  addressType:
    address.addressType,
  city: address.city,
  state: address.state,
  pincode: Number(address.pincode),
});

export default function Cart({
  cart,
  setCart,
  user,
}) {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [address, setAddress] =
    useState(emptyAddress);

  const [savedAddresses, setSavedAddresses] =
    useState([]);

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState("");

  const [step, setStep] =
    useState(1);

  const [savedOrder, setSavedOrder] =
    useState(null);

  const [checkoutError, setCheckoutError] =
    useState("");

  const queryParams =
    new URLSearchParams(
      location.search
    );

  const isBuyNow =
    queryParams.get(
      "buyNow"
    ) === "true";

  const [showCheckout, setShowCheckout] =
    useState(isBuyNow);

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

  useEffect(() => {
    if (!user) {
      setSavedAddresses([]);
      return;
    }

    const loadSavedAddresses =
      async () => {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) return;

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

        if (!res.ok) return;

        const data =
          await res.json();

        setSavedAddresses(data);
      };

    loadSavedAddresses();
  }, [user]);

  const groupedCart =
    finalCart.reduce(
      (acc, item) => {
        const existing =
          acc.find(
            (cartItem) =>
              cartItem._id === item._id
          );

        if (existing) {
          existing.quantity += 1;
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
      (acc, item) =>
        acc +
        item.price * item.quantity,
      0
    );

  const addOneToCart = (product) => {
    if (product.stock <= product.quantity) {
      alert(
        "No more stock available"
      );
      return;
    }

    setCart([...cart, product]);
  };

  const removeOneFromCart = (
    productId
  ) => {
    const index = cart.findIndex(
      (item) => item._id === productId
    );

    if (index === -1) return;

    setCart(
      cart.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const removeProductFromCart = (
    productId
  ) => {
    setCart(
      cart.filter(
        (item) => item._id !== productId
      )
    );
  };

  const updateAddress = (
    name,
    value
  ) => {
    setAddress({
      ...address,
      [name]: value,
    });
    setSelectedAddressId("");
    setCheckoutError("");
  };

  const applySavedAddress = (
    savedAddress
  ) => {
    setAddress(
      buildCheckoutAddress(
        savedAddress
      )
    );
    setSelectedAddressId(
      savedAddress._id
    );
    setCheckoutError("");
  };

  const validateAddress = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "pincode",
      "state",
      "city",
      "houseNo",
      "roadName",
    ];

    const missingField =
      requiredFields.find(
        (field) =>
          !String(
            address[field] ?? ""
          ).trim()
      );

    if (missingField) {
      setCheckoutError(
        "Warning: fill all the required details."
      );
      return false;
    }

    setCheckoutError("");
    return true;
  };

  const validateStock = () => {
    const invalidItem =
      groupedCart.find(
        (item) =>
          item.quantity > item.stock
      );

    if (invalidItem) {
      alert(
        `${invalidItem.name} has only ${invalidItem.stock} stock available. Please reduce quantity.`
      );
      return false;
    }

    return true;
  };

  const goToSummary = async () => {
    if (!user) {
      alert(
        "Please login first"
      );
      navigate("/login");
      return;
    }

    if (!validateAddress()) {
      return;
    }

    if (selectedAddressId) {
      setStep(2);
      return;
    }

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      alert(
        "Please login first"
      );
      navigate("/login");
      return;
    }

    const res = await fetch(
      "http://localhost:5000/api/addresses",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify(
          buildSavedAddressPayload(
            address
          )
        ),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setCheckoutError(
        data.message ||
          "Warning: fill all the required details."
      );
      return;
    }

    setSavedAddresses([
      data,
      ...savedAddresses,
    ]);
    setSelectedAddressId(data._id);
    setAddress(
      buildCheckoutAddress(data)
    );
    setStep(2);
  };

  const startCheckout = () => {
    if (!user) {
      alert(
        "Please login first"
      );
      navigate("/login");
      return;
    }

    if (groupedCart.length === 0) {
      return;
    }

    if (!validateStock()) {
      return;
    }

    setShowCheckout(true);
    setStep(1);
  };

  const handleCheckout =
    async () => {
      if (!user) {
        alert(
          "Please login first"
        );

        navigate("/login");
        return;
      }

      if (!validateAddress()) {
        return;
      }

      if (!validateStock()) {
        return;
      }

      setStep(3);

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
                  groupedCart.map(
                    (item) => ({
                      productId:
                        item._id,
                      name:
                        item.name,
                      price:
                        item.price,
                      image:
                        item.image,
                      description:
                        item.description,
                      quantity:
                        item.quantity,
                    })
                  ),

                totalAmount:
                  total,

                paymentId:
                  response.razorpay_payment_id,

                shippingAddress:
                  {
                    ...address,
                    phone:
                      Number(
                        address.phone
                      ),
                    pincode:
                      Number(
                        address.pincode
                      ),
                  },
              };

            const res = await fetch(
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

            if (!res.ok) {
              const data =
                await res.json();

              alert(
                data.message ||
                  "Order failed"
              );
              return;
            }

            const saved =
              await res.json();

            if (!isBuyNow) {
              setCart([]);
            }

            localStorage.removeItem(
              "buyNowProduct"
            );

            setSavedOrder(saved);
            setStep(4);
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

  if (savedOrder && step === 4) {
    return (
      <div style={successPageStyle}>
        <div style={successCardStyle}>
          <div style={successIconStyle}>
            ✓
          </div>
          <h1>Order Successful</h1>
          <p style={mutedStyle}>
            Your payment is complete and your order has been placed.
          </p>
          <p style={mutedStyle}>
            Order ID:{" "}
            <strong>
              {savedOrder._id}
            </strong>
          </p>
          <p style={statusPillStyle}>
            Status:{" "}
            {savedOrder.status ||
              "Pending"}
          </p>
          <button
            onClick={() =>
              navigate("/orders")
            }
            style={checkoutButton}
          >
            View My Orders
          </button>
          <button
            onClick={() =>
              navigate("/")
            }
            style={secondaryButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!showCheckout) {
    return (
      <div style={cartPageStyle}>
        <div style={cartHeaderStyle}>
          <h1>Shopping Cart</h1>
          <button
            onClick={() =>
              navigate("/")
            }
            style={textButtonStyle}
          >
            Continue Shopping
          </button>
        </div>

        {groupedCart.length === 0 && (
          <div style={emptyCartStyle}>
            <h2>Your cart is empty</h2>
            <p style={mutedStyle}>
              Add products to your cart before checkout.
            </p>
          </div>
        )}

        {groupedCart.length > 0 && (
          <div style={cartLayoutStyle}>
            <div style={sectionStyle}>
              <h2>Cart Items</h2>

              {groupedCart.map((item) => (
                <div
                  key={item._id}
                  style={cartItemStyle}
                >
                  <div style={itemInfoStyle}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={imageStyle}
                    />

                    <div>
                      <h3>{item.name}</h3>
                      <p style={mutedStyle}>
                        {item.description}
                      </p>
                      <h3 style={priceStyle}>
                        Rs {item.price}
                      </h3>
                      <p style={mutedStyle}>
                        Stock left:{" "}
                        {item.stock}
                      </p>
                    </div>
                  </div>

                  <div style={cartActionsStyle}>
                    <div style={quantityBoxStyle}>
                      <button
                        onClick={() =>
                          removeOneFromCart(
                            item._id
                          )
                        }
                        style={quantityButtonStyle}
                      >
                        -
                      </button>
                      <strong>
                        {item.quantity}
                      </strong>
                      <button
                        onClick={() =>
                          addOneToCart(item)
                        }
                        style={quantityButtonStyle}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeProductFromCart(
                          item._id
                        )
                      }
                      style={dangerButton}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={summaryStyle}>
              <h2>Price Details</h2>
              <div style={priceRowStyle}>
                <span>Total items</span>
                <span>
                  {cart.length}
                </span>
              </div>
              <div style={priceRowStyle}>
                <span>Total amount</span>
                <strong>
                  Rs {total}
                </strong>
              </div>
              <button
                onClick={startCheckout}
                style={checkoutButton}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={checkoutPageStyle}>
      <div style={checkoutHeaderStyle}>
        <button
          onClick={() => {
            if (step === 1) {
              if (isBuyNow) {
                navigate(-1);
              } else {
                setShowCheckout(false);
              }
            } else {
              setStep(step - 1);
            }
          }}
          style={backButtonStyle}
        >
          ←
        </button>
        <h2 style={{ margin: 0 }}>
          {step === 1
            ? "Add delivery address"
            : step === 2
            ? "Order summary"
            : "Payment"}
        </h2>
      </div>

      <div style={stepperStyle}>
        {steps.map(
          (label, index) => {
            const number =
              index + 1;
            const active =
              step >= number;

            return (
              <div
                key={label}
                style={stepItemStyle}
              >
                <div
                  style={{
                    ...stepCircleStyle,
                    background:
                      active
                        ? "#2563eb"
                        : "white",
                    color: active
                      ? "white"
                      : "#2563eb",
                  }}
                >
                  {number}
                </div>
                <span>{label}</span>
              </div>
            );
          }
        )}
      </div>

      {finalCart.length === 0 && (
        <h2>Your cart is empty</h2>
      )}

      {checkoutError && (
        <p style={errorStyle}>
          {checkoutError}
        </p>
      )}

      {groupedCart.length > 0 &&
        step === 1 && (
          <div style={sectionStyle}>
            {savedAddresses.length >
              0 && (
              <div
                style={
                  savedAddressListStyle
                }
              >
                <h3 style={{ marginTop: 0 }}>
                  Use saved address
                </h3>
                {savedAddresses.map(
                  (savedAddress) => (
                    <button
                      key={
                        savedAddress._id
                      }
                      type="button"
                      onClick={() =>
                        applySavedAddress(
                          savedAddress
                        )
                      }
                      style={{
                        ...savedAddressButtonStyle,
                        borderColor:
                          selectedAddressId ===
                          savedAddress._id
                            ? "#2563eb"
                            : "#d1d5db",
                        background:
                          selectedAddressId ===
                          savedAddress._id
                            ? "#eff6ff"
                            : "white",
                      }}
                    >
                      <strong>
                        {
                          savedAddress.fullName
                        }
                      </strong>
                      <span>
                        {
                          savedAddress.phone
                        }
                      </span>
                      <span>
                        {
                          savedAddress.addressLine1
                        }
                        ,{" "}
                        {
                          savedAddress.addressLine2
                        }
                        ,{" "}
                        {savedAddress.city}
                        ,{" "}
                        {savedAddress.state} -{" "}
                        {
                          savedAddress.pincode
                        }
                      </span>
                    </button>
                  )
                )}
              </div>
            )}

            <div style={formGridStyle}>
              <input
                placeholder="Full Name (Required) *"
                value={address.fullName}
                onChange={(e) =>
                  updateAddress(
                    "fullName",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Phone number (Required) *"
                value={address.phone}
                onChange={(e) =>
                  updateAddress(
                    "phone",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
              <input
                placeholder="Alternate phone number"
                value={
                  address.alternatePhone
                }
                onChange={(e) =>
                  updateAddress(
                    "alternatePhone",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
              <div style={twoColumnStyle}>
                <input
                  type="number"
                  placeholder="Pincode (Required) *"
                  value={address.pincode}
                  onChange={(e) =>
                    updateAddress(
                      "pincode",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
                <input
                  placeholder="City (Required) *"
                  value={address.city}
                  onChange={(e) =>
                    updateAddress(
                      "city",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
              </div>
              <input
                placeholder="State (Required) *"
                value={address.state}
                onChange={(e) =>
                  updateAddress(
                    "state",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
              <input
                placeholder="House No., Building Name (Required) *"
                value={address.houseNo}
                onChange={(e) =>
                  updateAddress(
                    "houseNo",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
              <input
                placeholder="Road name, Area, Colony (Required) *"
                value={address.roadName}
                onChange={(e) =>
                  updateAddress(
                    "roadName",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
              <input
                placeholder="Nearby famous shop, mall, or landmark"
                value={address.landmark}
                onChange={(e) =>
                  updateAddress(
                    "landmark",
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <div>
                <p style={labelStyle}>
                  Type of address
                </p>
                <div style={buttonRowStyle}>
                  {["Home", "Work"].map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          updateAddress(
                            "addressType",
                            type
                          )
                        }
                        style={{
                          ...addressTypeButton,
                          background:
                            address.addressType ===
                            type
                              ? "#eff6ff"
                              : "white",
                          borderColor:
                            address.addressType ===
                            type
                              ? "#2563eb"
                              : "#d1d5db",
                        }}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={goToSummary}
                style={saveAddressButton}
              >
                Save Address
              </button>
            </div>
          </div>
        )}

      {groupedCart.length > 0 &&
        step === 2 && (
          <div style={summaryLayoutStyle}>
            <div style={sectionStyle}>
              <h2>Deliver to</h2>
              <p style={mutedStyle}>
                <strong>
                  {address.fullName}
                </strong>
                , {address.phone}
              </p>
              <p style={mutedStyle}>
                {address.houseNo},{" "}
                {address.roadName}
                {address.landmark
                  ? `, ${address.landmark}`
                  : ""}
                , {address.city},{" "}
                {address.state} -{" "}
                {address.pincode}
              </p>
              <button
                onClick={() =>
                  setStep(1)
                }
                style={textButtonStyle}
              >
                Change address
              </button>
            </div>

            <div style={sectionStyle}>
              <h2>Order Summary</h2>
              {groupedCart.map(
                (item) => (
                  <div
                    key={item._id}
                    style={cartItemStyle}
                  >
                    <div
                      style={itemInfoStyle}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={imageStyle}
                      />

                      <div>
                        <h3>
                          {item.name}
                        </h3>
                        <p
                          style={
                            mutedStyle
                          }
                        >
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>
                        <h3
                          style={
                            priceStyle
                          }
                        >
                          Rs{" "}
                          {item.price *
                            item.quantity}
                        </h3>
                      </div>
                    </div>

                    {!isBuyNow && (
                      <button
                        onClick={() =>
                          removeProductFromCart(
                            item._id
                          )
                        }
                        style={
                          dangerButton
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )
              )}
            </div>

            <div style={summaryStyle}>
              <h2>Price Details</h2>
              <div style={priceRowStyle}>
                <span>Items</span>
                <span>
                  {groupedCart.length}
                </span>
              </div>
              <div style={priceRowStyle}>
                <span>Total</span>
                <strong>
                  Rs {total}
                </strong>
              </div>
              <button
                onClick={handleCheckout}
                style={checkoutButton}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

      {groupedCart.length > 0 &&
        step === 3 && (
          <div style={sectionStyle}>
            <h1>Complete Payment</h1>
            <p style={mutedStyle}>
              Razorpay payment window is opening. Complete payment to place your order.
            </p>
            <button
              onClick={handleCheckout}
              style={checkoutButton}
            >
              Open Payment Again
            </button>
          </div>
        )}
    </div>
  );
}

const checkoutPageStyle = {
  background: "#f3f4f6",
  minHeight: "100vh",
};

const cartPageStyle = {
  background: "#f3f4f6",
  minHeight: "100vh",
  padding: "30px",
};

const cartHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "24px",
};

const emptyCartStyle = {
  background: "white",
  padding: "32px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const cartLayoutStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) minmax(280px, 360px)",
  gap: "24px",
  alignItems: "start",
};

const cartActionsStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const quantityBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "999px",
  padding: "6px 10px",
};

const quantityButtonStyle = {
  width: "32px",
  height: "32px",
  border: "none",
  borderRadius: "50%",
  background: "#e5e7eb",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "18px",
};

const checkoutHeaderStyle = {
  background: "white",
  display: "flex",
  gap: "16px",
  alignItems: "center",
  padding: "16px 24px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
};

const backButtonStyle = {
  border: "none",
  background: "transparent",
  fontSize: "34px",
  cursor: "pointer",
  lineHeight: 1,
};

const stepperStyle = {
  background: "white",
  display: "flex",
  justifyContent: "center",
  gap: "36px",
  padding: "18px",
  borderBottom: "1px solid #e5e7eb",
  flexWrap: "wrap",
};

const stepItemStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#111827",
  fontSize: "14px",
};

const stepCircleStyle = {
  width: "28px",
  height: "28px",
  border: "1px solid #2563eb",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontWeight: "bold",
  marginBottom: "6px",
};

const sectionStyle = {
  background: "white",
  margin: "24px",
  padding: "24px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const formGridStyle = {
  display: "grid",
  gap: "18px",
};

const savedAddressListStyle = {
  display: "grid",
  gap: "12px",
  marginBottom: "24px",
};

const savedAddressButtonStyle = {
  display: "grid",
  gap: "6px",
  width: "100%",
  textAlign: "left",
  padding: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  color: "#111827",
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
};

const cartItemStyle = {
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  borderBottom: "1px solid #e5e7eb",
  flexWrap: "wrap",
};

const itemInfoStyle = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
  flexWrap: "wrap",
};

const imageStyle = {
  width: "120px",
  height: "120px",
  objectFit: "cover",
  borderRadius: "12px",
};

const mutedStyle = {
  color: "#6b7280",
};

const priceStyle = {
  color: "#2563eb",
};

const dangerButton = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const summaryStyle = {
  background: "white",
  margin: "24px",
  padding: "24px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const inputStyle = {
  padding: "17px",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  fontSize: "16px",
};

const checkoutButton = {
  marginTop: "20px",
  width: "100%",
  padding: "15px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const saveAddressButton = {
  ...checkoutButton,
  background: "#f97316",
};

const secondaryButton = {
  ...checkoutButton,
  background: "#111827",
};

const labelStyle = {
  color: "#475569",
  marginBottom: "10px",
};

const buttonRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const addressTypeButton = {
  minWidth: "120px",
  padding: "12px 18px",
  border: "1px solid #d1d5db",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "16px",
};

const errorStyle = {
  margin: "24px",
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "12px",
  borderRadius: "8px",
};

const summaryLayoutStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr)",
};

const textButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#2563eb",
  padding: 0,
  cursor: "pointer",
  fontWeight: "bold",
};

const priceRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb",
};

const successPageStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f3f4f6",
  padding: "24px",
};

const successCardStyle = {
  background: "white",
  width: "min(520px, 100%)",
  textAlign: "center",
  borderRadius: "12px",
  padding: "36px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
};

const successIconStyle = {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  background: "#16a34a",
  color: "white",
  display: "grid",
  placeItems: "center",
  fontSize: "42px",
  margin: "0 auto 18px",
};

const statusPillStyle = {
  display: "inline-block",
  background: "#dcfce7",
  color: "#166534",
  padding: "10px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
};
