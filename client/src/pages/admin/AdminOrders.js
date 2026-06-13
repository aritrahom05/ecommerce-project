import {
  useEffect,
  useState,
} from "react";

const statuses = [
  "Pending",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Exchange Requested",
];

export default function AdminOrders() {
  const [orders, setOrders] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("All");

  const token =
    localStorage.getItem("token");

  const fetchOrders = () => {
    fetch(
      "http://localhost:5000/api/orders"
    )
      .then((res) => res.json())
      .then((data) =>
        setOrders(data)
      );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    orderId,
    status
  ) => {
    const res = await fetch(
      `http://localhost:5000/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    if (!res.ok) {
      setMessage(
        "Status update failed. Please login as admin."
      );
      return;
    }

    setMessage(
      "Order status updated successfully"
    );

    fetchOrders();
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter(
          (order) =>
            order.status ===
            filterStatus
        );

  return (
    <>
      <div className="orders-page">

        <div className="orders-header">
          <h1>
            Order Management 
          </h1>

          <p>
            Track, update and manage all customer orders.
          </p>
        </div>

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* STAT CARDS */}

        <div className="stats-grid">

          <div
            className="stat-card"
            onClick={() =>
              setFilterStatus("All")
            }
          >
            <h2>{orders.length}</h2>
            <p>Total Orders</p>
          </div>

          <div
            className="stat-card"
            onClick={() =>
              setFilterStatus(
                "Pending"
              )
            }
          >
            <h2>
              {
                orders.filter(
                  (o) =>
                    o.status ===
                    "Pending"
                ).length
              }
            </h2>
            <p>Pending</p>
          </div>

          <div
            className="stat-card"
            onClick={() =>
              setFilterStatus(
                "Delivered"
              )
            }
          >
            <h2>
              {
                orders.filter(
                  (o) =>
                    o.status ===
                    "Delivered"
                ).length
              }
            </h2>
            <p>Delivered</p>
          </div>

          <div
            className="stat-card"
            onClick={() =>
              setFilterStatus(
                "Cancelled"
              )
            }
          >
            <h2>
              {
                orders.filter(
                  (o) =>
                    o.status ===
                    "Cancelled"
                ).length
              }
            </h2>
            <p>Cancelled</p>
          </div>

          <div
            className="stat-card exchange"
            onClick={() =>
              setFilterStatus(
                "Exchange Requested"
              )
            }
          >
            <h2>
              {
                orders.filter(
                  (o) =>
                    o.status ===
                    "Exchange Requested"
                ).length
              }
            </h2>
            <p>Exchange</p>
          </div>

        </div>

        <h3 className="filter-text">
          Showing: {filterStatus} Orders
        </h3>

        <div className="orders-list">

          {filteredOrders.map(
            (order) => (
              <div
                key={order._id}
                className="order-card"
              >

                <div className="top-row">

                  <div>

                    <h2>
                      Order #
                      {order._id.slice(
                        -6
                      )}
                    </h2>

                    <p className="muted">
                      Payment ID:{" "}
                      {order.paymentId ||
                        "Not available"}
                    </p>

                    <p className="muted">
                      Ordered At:{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <select
                    className="status-select"
                    value={
                      order.status ||
                      "Pending"
                    }
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                  >
                    {statuses.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                          style={{
                            color:
                              "black",
                          }}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>

                </div>

                <div className="content-grid">

                  <div>

                    <div className="section-box">
                      <h3>
                        Customer Address
                      </h3>

                      {order.shippingAddress ? (
                        <p className="muted">

                          {
                            order.shippingAddress
                              .fullName
                          }
                          <br />

                          {
                            order.shippingAddress
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
                            order.shippingAddress
                              .roadName
                          }

                          {order
                            .shippingAddress
                            .landmark
                            ? `, ${order.shippingAddress.landmark}`
                            : ""}

                          ,{" "}

                          {
                            order.shippingAddress
                              .city
                          }
                          ,{" "}

                          {
                            order.shippingAddress
                              .state
                          }

                          {" - "}

                          {
                            order.shippingAddress
                              .pincode
                          }

                        </p>
                      ) : (
                        <p className="muted">
                          No address saved
                        </p>
                      )}
                    </div>

                    <div className="section-box">

                      <h3>
                        Products
                      </h3>

                      {order.items.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={index}
                            className="item-row"
                          >
                            <span>
                              {item.name}
                            </span>

                            <span>
                              Qty{" "}
                              {item.quantity ||
                                1}
                            </span>

                            <strong>
                              Rs {item.price}
                            </strong>

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  <div className="side-panel">

                    <div className="amount-box">
                      <span>Total</span>

                      <h2>
                        Rs{" "}
                        {
                          order.totalAmount
                        }
                      </h2>
                    </div>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>
            <style>{`

      *{
        box-sizing:border-box;
      }

      .orders-page{
        min-height:100vh;
        padding:50px;

        background:
        linear-gradient(
          to right,
          #0f172a,
          #1e3a8a
        );
      }

      /* HEADER */

      .orders-header h1{
        margin:0 0 10px 0;
        font-size:42px;
        color:white;
      }

      .orders-header p{
        color:#cbd5e1;
        margin-bottom:30px;
        font-size:17px;
      }

      /* MESSAGE */

      .message-box{
        background:
        rgba(34,197,94,.15);

        border:
        1px solid rgba(
          34,197,94,.25
        );

        padding:14px;
        border-radius:14px;
        margin-bottom:25px;
        color:white;
      }

      /* STATS */

      .stats-grid{
        display:grid;

        grid-template-columns:
        repeat(auto-fit,minmax(180px,1fr));

        gap:18px;
        margin-bottom:30px;
      }

      .stat-card{
        background:
        rgba(255,255,255,0.12);

        backdrop-filter:
        blur(18px);

        border:
        1px solid rgba(
          255,255,255,.15
        );

        border-radius:22px;
        padding:22px;

        text-align:center;
        cursor:pointer;
        color:white;

        transition:.3s ease;
      }

      .stat-card h2{
        margin:0 0 6px 0;
        font-size:28px;
      }

      .stat-card:hover{
        transform:
        translateY(-4px);

        box-shadow:
        0 12px 28px rgba(
          37,99,235,.25
        );
      }

      .exchange:hover{
        box-shadow:
        0 12px 28px rgba(
          249,115,22,.25
        );
      }

      /* FILTER */

      .filter-text{
        color:white;
        margin-bottom:22px;
      }

      /* ORDERS */

      .orders-list{
        display:grid;
        gap:24px;
      }

      .order-card{
        background:
        rgba(255,255,255,0.12);

        backdrop-filter:
        blur(18px);

        border:
        1px solid rgba(
          255,255,255,.15
        );

        border-radius:24px;
        padding:26px;

        color:white;

        transition:.35s ease;
      }

      .order-card:hover{
        transform:
        translateY(-4px);

        box-shadow:
        0 12px 32px rgba(
          0,0,0,.25
        );
      }

      /* TOP */

      .top-row{
        display:flex;
        justify-content:
        space-between;

        gap:18px;
        flex-wrap:wrap;
      }

      .top-row h2{
        margin:0 0 10px 0;
      }

      .muted{
        color:#cbd5e1;
        line-height:1.7;
      }

      /* SELECT */

      .status-select{
        min-width:190px;
        height:46px;

        border:none;
        outline:none;

        border-radius:12px;

        padding:0 14px;

        background:
        rgba(255,255,255,.12);

        color:white;

        border:
        1px solid rgba(
          255,255,255,.15
        );

        cursor:pointer;

        transition:.3s;
      }

      .status-select:focus{
        border:
        1px solid #3b82f6;

        box-shadow:
        0 0 16px rgba(
          59,130,246,.25
        );
      }

      /* CONTENT */

      .content-grid{
        display:grid;

        grid-template-columns:
        2fr 1fr;

        gap:30px;
        margin-top:22px;
      }

      .section-box{
        margin-top:18px;
        padding-top:18px;

        border-top:
        1px solid rgba(
          255,255,255,.10
        );
      }

      .section-box h3{
        margin-bottom:14px;
      }

      /* ITEMS */

      .item-row{
        display:grid;

        grid-template-columns:
        1fr 100px 100px;

        gap:14px;

        align-items:center;

        padding:12px 0;

        border-bottom:
        1px solid rgba(
          255,255,255,.05
        );
      }

      /* SIDE PANEL */

      .side-panel{
        display:flex;
        justify-content:center;
        align-items:flex-start;
      }

      .amount-box{
        background:
        rgba(37,99,235,.15);

        border:
        1px solid rgba(
          37,99,235,.25
        );

        padding:20px 26px;

        border-radius:18px;

        min-width:180px;
        text-align:center;
      }

      .amount-box span{
        color:#cbd5e1;
        font-size:14px;
      }

      .amount-box h2{
        margin:8px 0 0 0;
        color:#60a5fa;
        font-size:30px;
      }

      /* MOBILE */

      @media(max-width:900px){

        .content-grid{
          grid-template-columns:1fr;
        }

      }

      @media(max-width:768px){

        .orders-page{
          padding:30px 18px;
        }

        .orders-header h1{
          font-size:34px;
        }

        .item-row{
          grid-template-columns:1fr;
          gap:6px;
        }

      }

      `}</style>
    </>
  );
}