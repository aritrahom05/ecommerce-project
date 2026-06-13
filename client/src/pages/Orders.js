import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";

export default function Orders({ user }) {
  const [orders, setOrders] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const navigate =
    useNavigate();

  const fetchOrders =
    useCallback(() => {
      fetch(
        "http://localhost:5000/api/orders"
      )
        .then((res) =>
          res.json()
        )
        .then((data) => {
          const userOrders =
            user
              ? data.filter(
                  (
                    order
                  ) =>
                    order.userId ===
                    user._id
                )
              : [];

          setOrders(
            userOrders
          );
        })
        .catch((err) => {
          console.log(
            err
          );
        });
    }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderAction =
    async (
      orderId,
      action
    ) => {
      if (!user) {
        setMessage(
          "Please login first."
        );
        return;
      }

      const res =
        await fetch(
          `http://localhost:5000/api/orders/${orderId}/action`,
          {
            method:
              "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              {
                action,
                userId:
                  user._id,
              }
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        setMessage(
          data.message ||
            "Order update failed"
        );
        return;
      }

      setMessage(
        action ===
          "cancel"
          ? "Order cancelled successfully."
          : "Exchange request submitted."
      );

      fetchOrders();
    };

  const getStatusColor =
    (status) => {
      switch (
        status
      ) {
        case "Pending":
          return "#f59e0b";
        case "Packed":
          return "#3b82f6";
        case "Shipped":
          return "#8b5cf6";
        case "Delivered":
          return "#22c55e";
        case "Cancelled":
          return "#ef4444";
        case "Exchange Requested":
          return "#f97316";
        default:
          return "#64748b";
      }
    };

  const filteredOrders =
    activeFilter ===
    "all"
      ? orders
      : orders.filter(
          (order) =>
            order.status ===
            activeFilter
        );

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (o) =>
        o.status ===
        "Pending"
    ).length;

  const deliveredOrders =
    orders.filter(
      (o) =>
        o.status ===
        "Delivered"
    ).length;

  const cancelledOrders =
    orders.filter(
      (o) =>
        o.status ===
        "Cancelled"
    ).length;

  const exchangeOrders =
    orders.filter(
      (o) =>
        o.status ===
        "Exchange Requested"
    ).length;

  const renderProgress =
    (status) => {
      const steps =
        [
          "Pending",
          "Packed",
          "Shipped",
          "Delivered",
        ];

      const currentIndex =
        steps.indexOf(
          status
        );

      return (
        <div className="progress-wrap">
          {steps.map(
            (
              step,
              index
            ) => (
              <div
                key={
                  step
                }
                className={
                  index <=
                  currentIndex
                    ? "progress-step done"
                    : "progress-step"
                }
              >
                {
                  step
                }
              </div>
            )
          )}
        </div>
      );
    };

  return (
    <>
      <div className="orders-page">

        <div className="header-box">
          <h1>
            My Orders 📦
          </h1>

          <p>
            Track your purchases and manage delivery.
          </p>
        </div>

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {orders.length >
          0 && (
          <div className="stats-grid">

            <div
              onClick={() =>
                setActiveFilter(
                  "all"
                )
              }
              className={
                activeFilter ===
                "all"
                  ? "stat-card active"
                  : "stat-card"
              }
            >
              <h3>
                {
                  totalOrders
                }
              </h3>
              <p>Total</p>
            </div>

            <div
              onClick={() =>
                setActiveFilter(
                  "Pending"
                )
              }
              className={
                activeFilter ===
                "Pending"
                  ? "stat-card active"
                  : "stat-card"
              }
            >
              <h3>
                {
                  pendingOrders
                }
              </h3>
              <p>Pending</p>
            </div>

            <div
              onClick={() =>
                setActiveFilter(
                  "Delivered"
                )
              }
              className={
                activeFilter ===
                "Delivered"
                  ? "stat-card active"
                  : "stat-card"
              }
            >
              <h3>
                {
                  deliveredOrders
                }
              </h3>
              <p>Delivered</p>
            </div>

            <div
              onClick={() =>
                setActiveFilter(
                  "Cancelled"
                )
              }
              className={
                activeFilter ===
                "Cancelled"
                  ? "stat-card active"
                  : "stat-card"
              }
            >
              <h3>
                {
                  cancelledOrders
                }
              </h3>
              <p>Cancelled</p>
            </div>

            <div
              onClick={() =>
                setActiveFilter(
                  "Exchange Requested"
                )
              }
              className={
                activeFilter ===
                "Exchange Requested"
                  ? "stat-card active"
                  : "stat-card"
              }
            >
              <h3>
                {
                  exchangeOrders
                }
              </h3>
              <p>Exchange</p>
            </div>

          </div>
        )}

        {filteredOrders.map(
          (
            order
          ) => {
            const status =
              order.status ||
              "Pending";

            const canCancel =
              [
                "Pending",
                "Packed",
              ].includes(
                status
              );

            const canExchange =
              [
                "Pending",
                "Packed",
                "Shipped",
                "Delivered",
              ].includes(
                status
              );

            return (
              <div
                key={
                  order._id
                }
                className="order-card"
              >
                                <div className="order-top">

                  <div>
                    <h2 className="price-text">
                      Rs{" "}
                      {order.totalAmount || 0}
                    </h2>

                    <p className="muted">
                      Ordered:{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="payment-id">
                      Payment ID:{" "}
                      {order.paymentId}
                    </p>

                    <span
                      className="status-pill"
                      style={{
                        background:
                          getStatusColor(
                            status
                          ),
                      }}
                    >
                      {status}
                    </span>
                  </div>

                </div>

                {status !==
                  "Cancelled" &&
                  renderProgress(
                    status
                  )}

                <div className="action-row">

                  {canCancel && (
                    <button
                      className="cancel-btn"
                      onClick={() =>
                        updateOrderAction(
                          order._id,
                          "cancel"
                        )
                      }
                    >
                      Cancel
                    </button>
                  )}

                  {canExchange && (
                    <button
                      className="exchange-btn"
                      onClick={() =>
                        updateOrderAction(
                          order._id,
                          "exchange"
                        )
                      }
                    >
                      Exchange
                    </button>
                  )}

                </div>

                {order.shippingAddress && (
                  <div className="address-box">

                    <strong>
                      Delivery Address
                    </strong>

                    <p className="muted">
                      {
                        order
                          .shippingAddress
                          .fullName
                      }{" "}
                      |{" "}
                      {
                        order
                          .shippingAddress
                          .phone
                      }

                      <br />

                      {order
                        .shippingAddress
                        .houseNo ||
                        order
                          .shippingAddress
                          .addressLine}
                      ,{" "}
                      {
                        order
                          .shippingAddress
                          .roadName
                      }
                      ,{" "}
                      {
                        order
                          .shippingAddress
                          .city
                      }
                      ,{" "}
                      {
                        order
                          .shippingAddress
                          .state
                      }
                      {" - "}
                      {
                        order
                          .shippingAddress
                          .pincode
                      }
                    </p>

                  </div>
                )}

                <div className="products-row">

                  {order.items &&
                    order.items.map(
                      (
                        item,
                        idx
                      ) => (
                        <div
                          key={
                            idx
                          }
                          className="mini-product"
                          onClick={() =>
                            navigate(
                              `/product/${item._id}`
                            )
                          }
                        >

                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            className="mini-img"
                          />

                          <h4>
                            {
                              item.name
                            }
                          </h4>

                          <p>
                            Rs{" "}
                            {
                              item.price
                            }{" "}
                            ×{" "}
                            {item.quantity ||
                              1}
                          </p>

                        </div>
                      )
                    )}

                </div>

              </div>
            );
          }
        )}

        {orders.length === 0 && (
          <div className="empty-box">
            <h2>
              No Orders Yet
            </h2>

            <p>
              Start shopping to see orders here.
            </p>
          </div>
        )}

      </div>

<style>{`

*{
box-sizing:border-box;
}

.orders-page{
min-height:100vh;
padding:32px;
background:
linear-gradient(
to right,
#0f172a,
#1e3a8a
);
}

.header-box h1{
font-size:52px;
color:white;
margin-bottom:6px;
}

.header-box p{
color:#cbd5e1;
margin-bottom:24px;
}

.message-box{
background:
rgba(34,197,94,.15);
padding:12px;
border-radius:12px;
color:white;
margin-bottom:20px;
}

.stats-grid{
display:grid;
grid-template-columns:
repeat(auto-fit,minmax(140px,1fr));
gap:14px;
margin-bottom:28px;
}

.stat-card{
background:
rgba(255,255,255,.12);
backdrop-filter:
blur(14px);
border:
1px solid rgba(255,255,255,.15);
padding:12px;
border-radius:16px;
text-align:center;
cursor:pointer;
color:white;
transition:.25s ease;
}

.stat-card.active{
border:
1px solid #3b82f6;
box-shadow:
0 0 16px rgba(
59,130,246,.2
);
}

.stat-card:hover{
transform:
translateY(-3px);
}

.order-card{
background:
rgba(255,255,255,.12);
backdrop-filter:
blur(14px);
border:
1px solid rgba(255,255,255,.15);
border-radius:22px;
padding:22px;
margin-bottom:24px;
color:white;
}

.order-top{
display:flex;
justify-content:
space-between;
gap:20px;
flex-wrap:wrap;
}

.price-text{
color:#60a5fa;
margin:0;
}

.payment-id{
font-weight:700;
}

.status-pill{
display:inline-block;
padding:8px 14px;
border-radius:999px;
font-weight:700;
margin-top:8px;
}

.progress-wrap{
display:flex;
gap:12px;
flex-wrap:wrap;
margin:20px 0;
}

.progress-step{
padding:8px 12px;
border-radius:12px;
background:
rgba(255,255,255,.08);
color:#94a3b8;
font-size:13px;
}

.progress-step.done{
background:#16a34a;
color:white;
}

.action-row{
display:flex;
gap:12px;
margin-bottom:20px;
flex-wrap:wrap;
}

.cancel-btn,
.exchange-btn{
border:none;
padding:10px 16px;
border-radius:12px;
cursor:pointer;
font-weight:700;
color:white;
}

.cancel-btn{
background:#dc2626;
}

.exchange-btn{
background:#2563eb;
}

.address-box{
background:
rgba(255,255,255,.08);
padding:14px;
border-radius:14px;
margin-bottom:18px;
}

.products-row{
display:flex;
gap:14px;
overflow-x:auto;
padding-bottom:8px;
}

.mini-product{
min-width:180px;
background:
rgba(255,255,255,.08);
padding:12px;
border-radius:14px;
cursor:pointer;
transition:.2s;
}

.mini-product:hover{
transform:
translateY(-3px);
}

.mini-img{
width:100%;
height:120px;
object-fit:contain;
background:white;
border-radius:10px;
padding:6px;
}

.mini-product h4{
margin:10px 0 6px 0;
}

.mini-product p{
color:#60a5fa;
font-weight:700;
}

.empty-box{
background:
rgba(255,255,255,.12);
padding:40px;
border-radius:20px;
text-align:center;
color:white;
}

.muted{
color:#cbd5e1;
line-height:1.6;
}

@media(max-width:768px){

.header-box h1{
font-size:38px;
}

.order-top{
flex-direction:column;
}

.stats-grid{
grid-template-columns:
repeat(2,1fr);
}

}

`}</style>

    </>
  );
}