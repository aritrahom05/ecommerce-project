import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({
  user,
  cart,
  setCart,
  wishlist,
  setWishlist,
}) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const requireLogin = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return false;
    }
    return true;
  };

  const isWishlisted = (productId) =>
    wishlist.some((item) => item._id === productId);

  const toggleWishlist = (product) => {
    if (!requireLogin()) return;

    if (isWishlisted(product._id)) {
      setWishlist(
        wishlist.filter(
          (item) => item._id !== product._id
        )
      );
      return;
    }

    setWishlist([...wishlist, product]);
  };

  const addToCart = (product) => {
    if (!requireLogin()) return;

    if (product.stock <= 0) {
      alert("Product is out of stock");
      return;
    }

    const alreadyInCart = cart.filter(
      (item) => item._id === product._id
    ).length;

    if (alreadyInCart >= product.stock) {
      alert(
        `Only ${product.stock} stock available`
      );
      return;
    }

    setCart([...cart, product]);
  };

  const buyNow = (product) => {
    if (!requireLogin()) return;

    if (product.stock <= 0) {
      alert("Product is out of stock");
      return;
    }

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify(product)
    );

    navigate("/cart?buyNow=true");
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) =>
          product.category?.trim()
        )
        .filter(Boolean)
    ),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText =
        debouncedSearch.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        [
          product.name,
          product.category,
          product.description,
          String(product.price || ""),
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    debouncedSearch,
    selectedCategory,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
  };

  const getStockBadge = (stock) => {
    if (stock === 0)
      return {
        text: "Out Of Stock",
        className: "badge-out",
      };

    if (stock < 5)
      return {
        text: "Limited Stock",
        className: "badge-limited",
      };

    if (stock > 20)
      return {
        text: "Best Seller",
        className: "badge-hot",
      };

    return {
      text: "In Stock",
      className: "badge-stock",
    };
  };

  const truncate = (text, max = 55) => {
    if (!text) return "";
    if (text.length <= max)
      return text;
    return text.slice(0, max) + "...";
  };

  return (
    <>
      <div className="home-page">

        <section className="hero-section">
          <h1>
            Shop Smarter.
            <span> Live Better.</span>
          </h1>

          <p>
            Browse quality products
            designed for your everyday
            lifestyle.
          </p>
        </section>

        <section className="filter-section">

  <div className="search-wrapper">
    <input
      type="text"
      placeholder="Search products, brands, categories..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />
  </div>

  <div className="category-row">
    {categories.map(
      (category) => (
        <button
          key={category}
          className={
            selectedCategory === category
              ? "category-pill active"
              : "category-pill"
          }
          onClick={() =>
            setSelectedCategory(category)
          }
        >
          {category}
        </button>
      )
    )}

    {(search ||
      selectedCategory !== "All") && (
      <button
        className="category-pill reset-pill"
        onClick={clearFilters}
      >
        Reset
      </button>
    )}
  </div>

          {!loading && (
            <div className="results-count">
              Showing{" "}
              {
                filteredProducts.length
              }{" "}
              products
            </div>
          )}
        </section>

        {loading && (
          <div className="product-grid">
            {[...Array(8)].map(
              (_, index) => (
                <div
                  key={index}
                  className="skeleton-card"
                />
              )
            )}
          </div>
        )}

        {!loading && (
          <div className="product-grid">
            {filteredProducts.map(
              (product) => {
                const badge =
                  getStockBadge(
                    product.stock
                  );

                return (
                  <div
                    key={product._id}
                    className="product-card"
                    onClick={() =>
                      navigate(
                        `/product/${product._id}`
                      )
                    }
                  >

                    <button
                      className={
                        isWishlisted(
                          product._id
                        )
                          ? "wishlist-btn active"
                          : "wishlist-btn"
                      }
                      onClick={(
                        e
                      ) => {
                        e.stopPropagation();
                        toggleWishlist(
                          product
                        );
                      }}
                    >
                      ♥
                    </button>

                    <div className="image-wrap">
                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/300"
                        }
                        alt={
                          product.name
                        }
                      />

                      <div className="hover-actions">

  <button
    disabled={
      product.stock <= 0
    }
    onClick={(e) => {
      e.stopPropagation();

      addToCart(
        product
      );
    }}
  >
    Add To Cart
  </button>

  <button
    disabled={
      product.stock <= 0
    }
    onClick={(e) => {
      e.stopPropagation();

      buyNow(
        product
      );
    }}
  >
    Buy Now
  </button>

</div>
                    </div>

                    <div className="product-info">

                      <div
                        className={`stock-badge ${badge.className}`}
                      >
                        {
                          badge.text
                        }
                      </div>

                      <h3>
                        {
                          product.name
                        }
                      </h3>

                      <p>
                        {truncate(
                          product.description
                        )}
                      </p>

                      <h2>
                        ₹{" "}
                        {
                          product.price
                        }
                      </h2>

                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
        {!loading &&
          filteredProducts.length === 0 && (
            <div className="empty-state">
              <h2>
                No products found
              </h2>
              <p>
                Try adjusting your
                search or filters.
              </p>
            </div>
          )}
      </div>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .home-page{
        min-height:100vh;
        padding:40px;
        background:
linear-gradient(
to right,
#0f172a,
#1e3a8a
);
        color:white;
        font-family:Inter,sans-serif;
      }

      .hero-section{
        margin-bottom:40px;
      }

      .hero-section h1{
        font-size:48px;
        font-weight:800;
        margin-bottom:10px;
        letter-spacing:-1px;
      }

      .hero-section span{
        color:#60a5fa;
      }

      .hero-section p{
        color:#94a3b8;
        font-size:18px;
        max-width:650px;
        line-height:1.6;
      }

      .filter-section{
        margin-bottom:35px;
      }

      .search-wrapper{
  width:100%;
  margin-bottom:25px;
}

.search-wrapper input{
  width:100%;
  height:58px;
  padding:0 22px;           /* remove vertical padding */
  border:none;
  outline:none;
  border-radius:18px;
  background:rgba(255,255,255,0.06);
  backdrop-filter:blur(20px);
  color:white;
  font-size:15px;
  line-height:58px;         /* force vertical centering */
  display:block;
  border:1px solid rgba(255,255,255,0.08);
  transition:all .3s ease;
  -webkit-appearance:none;
  appearance:none;
}

.search-wrapper input:focus{
  border:1px solid #3b82f6;
  box-shadow:0 0 25px rgba(59,130,246,.25);
}


      .category-row{
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        margin-bottom:20px;
      }

      .category-pill{
        border:none;
        padding:12px 18px;
        border-radius:999px;
        cursor:pointer;
        color:#cbd5e1;
        background:
        rgba(255,255,255,0.05);
        border:
        1px solid rgba(
        255,255,255,0.08
        );
        transition:all .3s ease;
        font-weight:500;
      }

      .category-pill:hover{
        transform:translateY(-3px);
        background:
        rgba(255,255,255,0.08);
      }

      .category-pill.active{
        background:
        linear-gradient(
        135deg,
        #2563eb,
        #3b82f6
        );
        color:white;
        box-shadow:
        0 0 20px rgba(
        59,130,246,0.35
        );
      }

      .reset-pill{
  background:rgba(239,68,68,0.12);
  color:#ef4444;
}

.reset-pill:hover{
  background:rgba(239,68,68,0.18);
}

      .results-count{
        color:#94a3b8;
        font-size:14px;
        margin-top:5px;
      }

      .product-grid{
  display:grid;
  grid-template-columns:
    repeat(auto-fill, minmax(320px, 320px));
  gap:28px;
  justify-content:center;
}

      .product-card{
        position:relative;
        overflow:hidden;
        border-radius:26px;
        background:
        rgba(255,255,255,0.05);
        backdrop-filter:blur(18px);
        border:
        1px solid rgba(
        255,255,255,0.08
        );
        transition:all .35s ease;
        cursor:pointer;
      }

      .product-card:hover{
        transform:translateY(-10px);
        box-shadow:
        0 20px 40px rgba(
        0,0,0,0.45
        );
        border:
        1px solid rgba(
        255,255,255,0.14
        );
      }

      .wishlist-btn{
        position:absolute;
        top:16px;
        right:16px;
        width:44px;
        height:44px;
        border-radius:50%;
        border:none;
        z-index:50;
        cursor:pointer;
        font-size:22px;
        background:
        rgba(0,0,0,0.45);
        color:#94a3b8;
        transition:.3s;
      }

      .wishlist-btn:hover{
        transform:scale(1.08);
      }

      .wishlist-btn.active{
        color:#ef4444;
        box-shadow:
        0 0 18px rgba(
        239,68,68,0.35
        );
      }

      .image-wrap{
        height:290px;
        position:relative;
        overflow:hidden;
      }

      .image-wrap img{
        width:100%;
        height:100%;
        object-fit:cover;
        transition:0.5s ease;
      }

      .product-card:hover img{
        transform:scale(1.08);
      }

      .hover-actions{
        position:absolute;
        bottom:-80px;
        left:0;
        right:0;
        display:flex;
        gap:12px;
        padding:16px;
        transition:.35s ease;
        background:
        linear-gradient(
        transparent,
        rgba(0,0,0,.75)
        );
      }

      .product-card:hover
      .hover-actions{
        bottom:0;
      }

      .hover-actions button{
        flex:1;
        padding:13px;
        border:none;
        border-radius:12px;
        cursor:pointer;
        font-weight:600;
        transition:.3s;
        color:white;
      }
              .hover-actions button:first-child{
        background:
        linear-gradient(
        135deg,
        #2563eb,
        #1d4ed8
        );
      }

      .hover-actions button:last-child{
        background:
        linear-gradient(
        135deg,
        #f97316,
        #ea580c
        );
      }

      .hover-actions button:disabled{
        background:#475569;
        cursor:not-allowed;
        opacity:.6;
      }

      .hover-actions button:hover{
        transform:translateY(-2px);
      }

      .product-info{
        padding:20px;
      }

      .stock-badge{
        display:inline-block;
        padding:6px 12px;
        border-radius:999px;
        font-size:12px;
        font-weight:700;
        margin-bottom:14px;
      }

      .badge-hot{
        background:
        rgba(245,158,11,.15);
        color:#f59e0b;
      }

      .badge-limited{
        background:
        rgba(239,68,68,.15);
        color:#ef4444;
      }

      .badge-stock{
        background:
        rgba(34,197,94,.15);
        color:#22c55e;
      }

      .badge-out{
        background:
        rgba(148,163,184,.15);
        color:#94a3b8;
      }

      .product-info h3{
        margin:0 0 10px 0;
        font-size:21px;
        font-weight:700;
        line-height:1.4;
      }

      .product-info p{
        color:#94a3b8;
        font-size:14px;
        line-height:1.5;
        min-height:42px;
        margin-bottom:15px;
      }

      .product-info h2{
        margin:0;
        color:#60a5fa;
        font-size:24px;
        font-weight:800;
      }

      .skeleton-card{
        height:430px;
        border-radius:26px;
        background:
        linear-gradient(
        90deg,
        rgba(255,255,255,.03) 25%,
        rgba(255,255,255,.07) 50%,
        rgba(255,255,255,.03) 75%
        );
        background-size:200% 100%;
        animation:
        shimmer 1.4s infinite;
      }

      @keyframes shimmer{
        0%{
          background-position:
          200% 0;
        }
        100%{
          background-position:
          -200% 0;
        }
      }

      .empty-state{
        padding:80px 20px;
        text-align:center;
      }

      .empty-state h2{
        font-size:30px;
        margin-bottom:10px;
      }

      .empty-state p{
        color:#94a3b8;
      }

      @media(max-width:768px){

        .home-page{
          padding:22px;
        }

        .hero-section h1{
          font-size:34px;
        }

        .hero-section p{
          font-size:15px;
        }

        .image-wrap{
          height:240px;
        }

        .hover-actions{
          position:static;
          background:none;
          padding:15px;
        }

        .product-card:hover
        .hover-actions{
          bottom:auto;
        }

      }

      `}</style>
    </>
  );
}