import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

export default function ProductDetails({
  user,
  cart,
  setCart,
  wishlist,
  setWishlist,
}) {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [product, setProduct] =
    useState(null);

  const isWishlisted =
    product &&
    wishlist.some(
      (item) => item._id === product._id
    );

  const toggleWishlist = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      setWishlist(
        wishlist.filter(
          (item) =>
            item._id !== product._id
        )
      );
      return;
    }

    setWishlist([
      ...wishlist,
      product,
    ]);
  };

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
    if (product.stock <= 0) {
      alert(
        "Product is out of stock"
      );
      return;
    }

    const alreadyInCart =
      cart.filter(
        (item) =>
          item._id === product._id
      ).length;

    if (
      alreadyInCart >= product.stock
    ) {
      alert(
        `Only ${product.stock} stock available`
      );
      return;
    }

    setCart([
      ...cart,
      product,
    ]);
  };

  // BUY NOW
  const buyNow = () => {
    if (product.stock <= 0) {
      alert(
        "Product is out of stock"
      );
      return;
    }

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
          position: "relative",
        }}
      >
        <button
          onClick={toggleWishlist}
          title={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border:
              "1px solid #e5e7eb",
            background: "white",
            color: isWishlisted
              ? "#ef4444"
              : "#64748b",
            fontSize: "28px",
            cursor: "pointer",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.12)",
            zIndex: 2,
          }}
        >
          ♥
        </button>

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
            Rs {product.price}
          </h2>

          <p
            style={{
              color:
                product.stock > 0
                  ? "#16a34a"
                  : "#ef4444",
              fontWeight:
                "bold",
              fontSize: "18px",
            }}
          >
            {product.stock > 0
              ? `${product.stock} left`
              : "Out of stock"}
          </p>

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
                  product.stock > 0
                    ? "#2563eb"
                    : "#94a3b8",
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
              disabled={
                product.stock <= 0
              }
            >
              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

            <button
              onClick={
                buyNow
              }
              style={{
                background:
                  product.stock > 0
                    ? "#111827"
                    : "#94a3b8",
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
              disabled={
                product.stock <= 0
              }
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
