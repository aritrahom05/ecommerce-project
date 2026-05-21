import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

export default function ProductDetails({
  cart,
  setCart,
}) {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [product, setProduct] =
    useState(null);

  // FETCH PRODUCT
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/products/${id}`
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // LOADING
  if (!product) {
    return (
      <h1
        style={{
          textAlign:
            "center",
          marginTop:
            "100px",
        }}
      >
        Loading product...
      </h1>
    );
  }

  // ADD TO CART
  const addToCart = () => {
    setCart([
      ...cart,
      product,
    ]);
  };

  // BUY NOW
  const buyNow = () => {
    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify(
        product
      )
    );

    navigate(
      "/cart?buyNow=true"
    );
  };

  return (
    <div
      style={{
        padding: "40px",
        background:
          "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background:
            "white",
          borderRadius:
            "24px",
          padding: "40px",
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              borderRadius:
                "20px",
              objectFit:
                "cover",
            }}
          />
        </div>

        {/* DETAILS */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            display: "flex",
            flexDirection:
              "column",
            justifyContent:
              "center",
          }}
        >
          <h1
            style={{
              fontSize:
                "48px",
              marginBottom:
                "10px",
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              color:
                "#6b7280",
              fontSize:
                "20px",
              lineHeight:
                "1.7",
            }}
          >
            {
              product.description
            }
          </p>

          <h2
            style={{
              color:
                "#2563eb",
              fontSize:
                "42px",
              marginTop:
                "20px",
            }}
          >
            ₹{product.price}
          </h2>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop:
                "30px",
              flexWrap:
                "wrap",
            }}
          >
            <button
              onClick={
                addToCart
              }
              style={{
                background:
                  "#2563eb",
                color:
                  "white",
                border: "none",
                padding:
                  "16px 28px",
                borderRadius:
                  "12px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
                fontSize:
                  "18px",
              }}
            >
              Add to Cart
            </button>

            <button
              onClick={
                buyNow
              }
              style={{
                background:
                  "#111827",
                color:
                  "white",
                border: "none",
                padding:
                  "16px 28px",
                borderRadius:
                  "12px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
                fontSize:
                  "18px",
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}