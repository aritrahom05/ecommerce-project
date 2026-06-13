import cartIcon from "./Cart_logo.png";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({
  user,
  setUser,
  cart,
  setCart,
  wishlist,
  setWishlist,
}) {
  const navigate = useNavigate();

  const logoutHandler = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <>
      <nav className="premium-navbar">

        <Link to="/" className="logo-wrap">
          <img
            src={cartIcon}
            alt="logo"
            className="nav-logo-img"
          />

          <div className="logo-text">
            <h2>ECART</h2>
            
          </div>
        </Link>

        <div className="nav-links">

          {user && (
            <>
              {/* WISHLIST */}
              <Link
                to="/wishlist"
                className="icon-link"
              >
                <div className="icon-wrapper">

                  <span className="heart-icon">
                    ♥
                  </span>

                  {wishlist.length > 0 && (
                    <span className="count-badge wishlist-badge">
                      {wishlist.length}
                    </span>
                  )}
                </div>
              </Link>

              {/* CART */}
              <Link
  to="/cart"
  className="icon-link cart-separator"
>
                <div className="icon-wrapper">

                  <img
                    src={cartIcon}
                    alt="cart"
                    className="cart-icon"
                  />

                  {cart.length > 0 && (
                    <span className="count-badge cart-badge">
                      {cart.length}
                    </span>
                  )}
                </div>
              </Link>
            </>
          )}

          {!user ? (
            <Link
              to="/login"
              className="nav-button"
            >
              Login
            </Link>
          ) : (
            <>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="admin-link"
                >
                  Admin
                </Link>
              )}

              <Link
                to="/profile"
                className="profile-pill"
              >
                👤 {user.name}
              </Link>

              <button
                onClick={logoutHandler}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .premium-navbar{
        position:sticky;
        top:0;
        z-index:1000;
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:14px 40px;

        background:
        rgba(8,18,38,0.96);

        backdrop-filter:blur(8px);

        border-bottom:
        1px solid rgba(
        59,130,246,0.12
        );

        box-shadow:
        0 8px 25px rgba(
        0,0,0,0.25
        );
      }

      .logo-wrap{
        display:flex;
        align-items:center;
        gap:14px;
        text-decoration:none;
        transition:.3s;
      }

      .logo-wrap:hover{
        transform:translateY(-2px);
      }

      .nav-logo-img{
        width:42px;
        height:42px;
        object-fit:contain;
      }

      .logo-text{
        display:flex;
        flex-direction:column;
      }

      .logo-text h2{
        margin:0;
        color:white;
        font-size:22px;
        letter-spacing:1px;
        font-weight:800;
      }

      .logo-text span{
        color:#94a3b8;
        font-size:11px;
        margin-top:2px;
      }

      .nav-links{
        display:flex;
        align-items:center;
        gap:18px;
      }

      .icon-link{
        text-decoration:none;
      }

      .icon-wrapper{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:.3s ease;
  cursor:pointer;
}

      .icon-wrapper:hover{
  transform:translateY(-2px);
}

      .heart-icon{
        color:#ef4444;
        font-size:22px;
      }

      .cart-icon{
        width:24px;
        height:24px;
      }

      .count-badge{
        position:absolute;
        top:-5px;
        right:-5px;
        min-width:18px;
        height:18px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:10px;
        font-weight:700;
        color:white;
        padding:2px;
      }

      .wishlist-badge{
        background:#ef4444;

        box-shadow:
        0 0 10px rgba(
        239,68,68,0.5
        );
      }

      .cart-badge{
        background:#2563eb;

        box-shadow:
        0 0 10px rgba(
        37,99,235,0.5
        );
      }

      .cart-separator{
  margin-right:12px;
}

      .nav-button{
        text-decoration:none;
        color:white;
        font-weight:600;
        padding:11px 18px;
        border-radius:14px;

        background:
        rgba(255,255,255,0.05);

        transition:.3s;
      }

      .nav-button:hover{
        background:
        rgba(255,255,255,0.1);
      }

      .admin-link{
        text-decoration:none;
        color:#60a5fa;
        font-weight:700;
        transition:.3s;
      }

      .admin-link:hover{
        transform:translateY(-2px);
      }

      .profile-pill{
  text-decoration:none;
  color:white;
  font-weight:700;
  transition:.3s;
}

      .profile-pill:hover{
  transform:translateY(-2px);
}
      .logout-btn{
  border:none;
  cursor:pointer;
  background:none;
  padding:0;
  font-weight:700;
  color:#ef4444;
  transition:.3s;
}

      .logout-btn:hover{
  transform:translateY(-2px);
}

      @media(max-width:768px){

        .premium-navbar{
          padding:14px 18px;
        }

        .logo-text span{
          display:none;
        }

        .logo-text h2{
          font-size:18px;
        }

        .nav-links{
  display:flex;
  align-items:center;
  gap:38px;
}

        .profile-pill{
          padding:8px 12px;
          font-size:13px;
        }

        .logout-btn{
          padding:8px 12px;
          font-size:13px;
        }

      }

      `}</style>
    </>
  );
}