import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetails({
  user,
  cart,
  setCart,
  wishlist,
  setWishlist,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

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

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/products/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!product) {
    return (
      <>
        <div className="loading-screen">
          Loading Product...
        </div>

        <style>{`
          .loading-screen{
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#0b1120;
            color:white;
            font-size:24px;
            font-weight:700;
          }
        `}</style>
      </>
    );
  }

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

  const buyNow = () => {
    if (product.stock <= 0) {
      alert(
        "Product is out of stock"
      );
      return;
    }

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify(product)
    );

    navigate(
      "/cart?buyNow=true"
    );
  };

  const getStockStatus = () => {
    if (product.stock === 0)
      return {
        text: "Out Of Stock",
        className: "stock-out",
      };

    if (product.stock < 5)
      return {
        text: "Limited Stock",
        className:
          "stock-limited",
      };

    return {
      text: "In Stock",
      className:
        "stock-available",
    };
  };

  const stockInfo =
    getStockStatus();

  return (
    <>
      <div className="product-page">

        <div className="product-container">

          {/* IMAGE */}
          <div className="image-section">

            <button
              onClick={
                toggleWishlist
              }
              className={
                isWishlisted
                  ? "wishlist-btn active"
                  : "wishlist-btn"
              }
            >
              ♥
            </button>

            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
          </div>

          {/* DETAILS */}
          <div className="details-section">

            <div
              className={`stock-pill ${stockInfo.className}`}
            >
              {
                stockInfo.text
              }
            </div>

            <h1>
              {product.name}
            </h1>

            <p className="description">
              {
                product.description
              }
            </p>

            <h2>
              ₹ {product.price}
            </h2>

            <p className="stock-count">
              Available Units:{" "}
              {product.stock}
            </p>

            <div className="button-group">

  <button
    onClick={
      addToCart
    }
    disabled={
      product.stock <= 0
    }
    className="cart-btn"
  >
    Add To Cart
  </button>

  <button
    onClick={
      buyNow
    }
    disabled={
      product.stock <= 0
    }
    className="buy-btn"
  >
    Buy Now
  </button>

</div>

          </div>
        </div>
      </div>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .product-page{
  min-height:100vh;
  padding:60px;

  background:
  linear-gradient(
    to right,
    #0f172a,
    #1e3a8a
  );

  color:white;
}

      .product-container{
  max-width:1400px;
  margin:auto;
  display:grid;
  grid-template-columns:1.1fr 1fr;
  gap:50px;

  background:
  rgba(255,255,255,0.08);

  backdrop-filter:blur(18px);

  border-radius:30px;
  padding:35px;

  border:
  1px solid rgba(
    255,255,255,0.12
  );

  box-shadow:
  0 20px 40px rgba(
    0,0,0,.20
  );
}

      .image-section{
  position:relative;
  overflow:hidden;

  border-radius:26px;

  background:white;

  padding:25px;

  box-shadow:
  inset 0 0 25px rgba(
    0,0,0,.05
  );
}

      .product-image{
        width:100%;
        height:100%;
        object-fit:cover;
        border-radius:26px;
        transition:.4s;
      }

      .image-section:hover .product-image{
        transform:scale(1.03);
      }

      .wishlist-btn{
        position:absolute;
        top:20px;
        right:20px;
        z-index:20;
        border:none;
        cursor:pointer;
        font-size:28px;
        background:
        rgba(0,0,0,.45);
        width:52px;
        height:52px;
        border-radius:50%;
        color:#94a3b8;
        transition:.3s;
      }

      .wishlist-btn.active{
        color:#ef4444;
        box-shadow:
        0 0 20px rgba(
          239,68,68,.4
        );
      }

      .wishlist-btn:hover{
        transform:scale(1.08);
      }

      .details-section{
  display:flex;
  flex-direction:column;
  justify-content:center;

  padding:20px;

  background:
  rgba(255,255,255,0.03);

  border-radius:24px;
}

      .stock-pill{
        display:inline-block;
        width:fit-content;
        padding:8px 16px;
        border-radius:999px;
        font-size:13px;
        font-weight:700;
        margin-bottom:18px;
      }

      .stock-available{
        background:
        rgba(34,197,94,.12);
        color:#22c55e;
      }

      .stock-limited{
        background:
        rgba(245,158,11,.12);
        color:#f59e0b;
      }

      .stock-out{
        background:
        rgba(239,68,68,.12);
        color:#ef4444;
      }

      .details-section h1{
        font-size:52px;
        margin:0 0 18px 0;
        font-weight:800;
        line-height:1.2;
      }

      .description{
        color:#94a3b8;
        font-size:18px;
        line-height:1.8;
        margin-bottom:22px;
      }

      .details-section h2{
        margin:0;
        font-size:42px;
        color:#60a5fa;
        font-weight:800;
      }

      .stock-count{
        margin-top:12px;
        color:#cbd5e1;
        font-size:15px;
      }

      .button-group{
        display:flex;
        gap:18px;
        margin-top:35px;
        flex-wrap:wrap;
      }

      .button-group button{
        border:none;
        cursor:pointer;
        padding:18px 34px;
        border-radius:14px;
        color:white;
        font-weight:700;
        font-size:17px;
        transition:.3s;
        min-width:160px;
      }

      .button-group button:hover{
        transform:translateY(-3px);
      }

      .cart-btn{
        background:
        linear-gradient(
          135deg,
          #2563eb,
          #1d4ed8
        );
      }

      .buy-btn{
        background:
        linear-gradient(
          135deg,
          #f97316,
          #ea580c
        );
      }

      .button-group button:disabled{
        background:#475569;
        cursor:not-allowed;
        opacity:.6;
      }

      @media(max-width:900px){

        .product-container{
          grid-template-columns:1fr;
        }

        .product-page{
          padding:25px;
          background:
linear-gradient(
to right,
#0f172a,
#1e3a8a
);
        }

        .details-section h1{
          font-size:36px;
        }

        .details-section h2{
          font-size:30px;
        }

      }

      `}</style>
    </>
  );
}