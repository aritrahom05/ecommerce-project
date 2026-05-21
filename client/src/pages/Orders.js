import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] =
    useState([]);

  useEffect(() => {
    fetch(
      "http://localhost:5000/api/orders"
    )
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          fontSize: "48px",
        }}
      >
        My Orders 📦
      </h1>

      {orders.length === 0 && (
        <h2>No Orders Yet</h2>
      )}

      {orders.map(
        (order, index) => (
          <div
            key={index}
            style={{
              background:
                "white",
              padding: "20px",
              borderRadius:
                "18px",
              marginBottom:
                "20px",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {/* TOP INFO */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "20px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h2
                style={{
                  color:
                    "#2563eb",
                  margin: 0,
                }}
              >
                ₹
                {order.totalAmount ||
                  0}
              </h2>

              <h3
                style={{
                  margin: 0,
                }}
              >
                Items:{" "}
                {order.items
                  ? order.items
                      .length
                  : 0}
              </h3>

              <p
                style={{
                  margin: 0,
                  fontWeight:
                    "bold",
                }}
              >
                Payment ID:{" "}
                {
                  order.paymentId
                }
              </p>
            </div>

            {/* PRODUCTS */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                overflowX:
                  "auto",
              }}
            >
              {order.items &&
                order.items.map(
                  (
                    item,
                    idx
                  ) => (
                    <div
                      key={idx}
                      style={{
                        minWidth:
                          "180px",
                        background:
                          "#f9fafb",
                        padding:
                          "12px",
                        borderRadius:
                          "15px",
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
                            "100%",
                          height:
                            "140px",
                          objectFit:
                            "cover",
                          borderRadius:
                            "12px",
                        }}
                      />

                      <h3
                        style={{
                          marginTop:
                            "10px",
                          marginBottom:
                            "5px",
                        }}
                      >
                        {
                          item.name
                        }
                      </h3>

                      <p
                        style={{
                          color:
                            "#2563eb",
                          fontWeight:
                            "bold",
                        }}
                      >
                        ₹
                        {
                          item.price
                        }
                      </p>
                    </div>
                  )
                )}
            </div>
          </div>
        )
      )}
    </div>
  );
}