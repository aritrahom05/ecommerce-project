import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

export default function Wishlist({
  user,
  wishlist,
  setWishlist,
  cart,
  setCart,
}) {
  const navigate =
    useNavigate();

  const [
    hoveredCard,
    setHoveredCard,
  ] = useState(null);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  if (!user) {
    return <Navigate to="/login" />;
  }

  const removeFromWishlist =
    (productId) => {
      setWishlist(
        wishlist.filter(
          (item) =>
            item._id !==
            productId
        )
      );
    };

  const addToCart = (
    product
  ) => {
    if (product.stock <= 0) {
      alert(
        "Product is out of stock"
      );
      return;
    }

    const alreadyInCart =
      cart.filter(
        (item) =>
          item._id ===
          product._id
      ).length;

    if (
      alreadyInCart >=
      product.stock
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

  const buyNow = (
    product
  ) => {
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

  const inStock =
    wishlist.filter(
      (item) =>
        item.stock > 0
    ).length;

  const outStock =
    wishlist.filter(
      (item) =>
        item.stock <= 0
    ).length;

  const filteredWishlist =
    activeFilter === "all"
      ? wishlist
      : activeFilter ===
        "instock"
      ? wishlist.filter(
          (item) =>
            item.stock > 0
        )
      : wishlist.filter(
          (item) =>
            item.stock <= 0
        );

  return (
    <>
      <div className="wishlist-page">

        <h1 className="title">
          Wishlist ❤️
        </h1>

        {wishlist.length >
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
                  wishlist.length
                }
              </h3>
              <p>Saved</p>
            </div>

            <div
              onClick={() =>
                setActiveFilter(
                  "instock"
                )
              }
              className={
                activeFilter ===
                "instock"
                  ? "stat-card active"
                  : "stat-card"
              }
            >
              <h3>
                {inStock}
              </h3>
              <p>In Stock</p>
            </div>

            <div
              onClick={() =>
                setActiveFilter(
                  "outstock"
                )
              }
              className={
                activeFilter ===
                "outstock"
                  ? "stat-card active"
                  : "stat-card"
              }
            >
              <h3>
                {outStock}
              </h3>
              <p>Out</p>
            </div>

          </div>
        )}

        {wishlist.length ===
          0 && (
          <div className="empty-card">

            <h2>
              Wishlist Empty
            </h2>

            <p>
              Save products
              for later.
            </p>

            <button
              onClick={() =>
                navigate("/")
              }
              className="browse-btn"
            >
              Browse
            </button>

          </div>
        )}

        <div className="products-grid">

          {filteredWishlist.map(
            (
              product,
              index
            ) => (
              <div
                key={
                  product._id
                }
                className="product-card"
                onClick={() =>
                  navigate(
                    `/product/${product._id}`
                  )
                }
                onMouseEnter={() =>
                  setHoveredCard(
                    index
                  )
                }
                onMouseLeave={() =>
                  setHoveredCard(
                    null
                  )
                }
                style={{
                  transform:
                    hoveredCard ===
                    index
                      ? "translateY(-6px)"
                      : "translateY(0)",
                }}
              >

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(
                      product._id
                    );
                  }}
                  className="heart-btn"
                >
                  ❤️
                </button>

                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/200"
                  }
                  alt={
                    product.name
                  }
                  className="product-img"
                />

                <h3>
                  {
                    product.name
                  }
                </h3>

                <p className="desc">
                  {
                    product.description
                  }
                </p>

                <div className="price-box">

                  <span className="price">
                    Rs{" "}
                    {
                      product.price
                    }
                  </span>

                  <span
                    className={
                      product.stock >
                      0
                        ? "stock green"
                        : "stock red"
                    }
                  >
                    {product.stock >
                    0
                      ? `In Stock (${product.stock})`
                      : "Out of Stock"}
                  </span>

                </div>

                <div className="action-row">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(
                        product
                      );
                    }}
                    disabled={
                      product.stock <=
                      0
                    }
                    className="cart-btn"
                  >
                    Cart
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      buyNow(
                        product
                      );
                    }}
                    disabled={
                      product.stock <=
                      0
                    }
                    className="buy-btn"
                  >
                    Buy
                  </button>

                </div>

              </div>
            )
          )}

        </div>
      </div>

<style>{`*{
box-sizing:border-box;
}

.wishlist-page{
min-height:100vh;
padding:32px;
background:
linear-gradient(
to right,
#0f172a,
#1e3a8a
);
}

/* TITLE */

.title{
color:white;
font-size:54px;
margin-bottom:22px;
font-weight:800;
}

/* SMALLER STAT CARDS */

.stats-grid{
display:grid;
grid-template-columns:
repeat(auto-fit,minmax(150px,1fr));
gap:14px;
margin-bottom:26px;
max-width:900px;
}

.stat-card{
background:
rgba(255,255,255,.12);
backdrop-filter:
blur(14px);
border:
1px solid rgba(255,255,255,.15);
border-radius:16px;
padding:10px 14px;
min-height:82px;
text-align:center;
color:white;
cursor:pointer;
transition:.25s ease;
}

.stat-card:hover{
transform:
translateY(-3px);
box-shadow:
0 10px 22px rgba(
37,99,235,.22
);
}

.stat-card.active{
border:
1px solid #3b82f6;
box-shadow:
0 0 18px rgba(
59,130,246,.18
);
}

.stat-card h3{
font-size:26px;
margin:0;
}

.stat-card p{
margin:4px 0 0 0;
color:#cbd5e1;
font-size:13px;
}

/* EMPTY */

.empty-card{
background:
rgba(255,255,255,.12);
backdrop-filter:
blur(14px);
padding:40px;
border-radius:20px;
color:white;
text-align:center;
margin-bottom:30px;
}

.browse-btn{
background:#2563eb;
border:none;
padding:12px 22px;
border-radius:12px;
color:white;
cursor:pointer;
font-weight:700;
margin-top:12px;
}

/* BIGGER PRODUCT GRID */

.products-grid{
display:grid;
grid-template-columns:
repeat(auto-fill,minmax(300px,300px));
justify-content:start;
gap:22px;
align-items:start;
}

/* PRODUCT CARD */

.product-card{
background:
rgba(255,255,255,.12);
backdrop-filter:
blur(14px);
border:
1px solid rgba(255,255,255,.15);
border-radius:20px;
padding:16px;
transition:.25s ease;
position:relative;
color:white;
cursor:pointer;

display:flex;
flex-direction:column;
align-items:stretch;

width:300px;
height:auto;
min-height:390px;
}

.product-card:hover{
box-shadow:
0 12px 30px rgba(
37,99,235,.22
);
}

/* HEART */

.heart-btn{
position:absolute;
top:12px;
right:12px;
width:38px;
height:38px;
border:none;
border-radius:50%;
background:
rgba(255,255,255,.15);
cursor:pointer;
font-size:18px;
}

/* IMAGE */

.product-img{
width:100%;
height:150px;
object-fit:contain;
display:block;
margin:0 auto 14px auto;
background:white;
border-radius:12px;
padding:8px;
}

/* TEXT */

.product-card h3{
margin:8px 0;
font-size:26px;
font-weight:700;
}

.desc{
min-height:40px;
font-size:14px;
line-height:1.4;
color:#cbd5e1;
}

/* PRICE */

.price-box{
display:flex;
justify-content:
space-between;
align-items:center;
margin:18px 0;
gap:8px;
}

.price{
font-size:24px;
font-weight:700;
color:#60a5fa;
}

/* STOCK */

.stock{
padding:6px 10px;
border-radius:10px;
font-size:12px;
font-weight:600;
white-space:nowrap;
}

.green{
background:#16a34a;
}

.red{
background:#dc2626;
}

/* BUTTONS */

.action-row{
display:grid;
grid-template-columns:
1fr 1fr;
gap:10px;
margin-top:auto;
}

.cart-btn,
.buy-btn{
padding:11px;
font-size:14px;
border:none;
border-radius:12px;
cursor:pointer;
font-weight:700;
color:white;
transition:.25s;
}

.cart-btn{
background:#2563eb;
}

.buy-btn{
background:#f97316;
}

.cart-btn:hover,
.buy-btn:hover{
transform:
translateY(-2px);
}

.cart-btn:disabled,
.buy-btn:disabled{
opacity:.45;
cursor:not-allowed;
}

/* MOBILE */

@media(max-width:768px){

.title{
font-size:38px;
}

.products-grid{
grid-template-columns:
1fr;
justify-content:center;
}

.product-card{
width:100%;
min-height:auto;
}

}

`}</style>

    </>
  );
}