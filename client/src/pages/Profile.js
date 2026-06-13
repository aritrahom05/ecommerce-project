import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

export default function Profile({
  user,
  cart,
  orders,
  wishlist,
}) {
  const navigate =
    useNavigate();

  const [hoveredCard, setHoveredCard] =
    useState(null);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="profile-page">

        {/* HEADER */}

        <div className="profile-card">

          <div className="avatar-circle">
            {user.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-info">

            <h1>
              {user.name}
            </h1>

            <p>
              {user.email}
            </p>

            <div className="badge-row">

              <span className="active-badge">
                ✅ Active Account
              </span>

              {user.isAdmin && (
                <span className="admin-badge">
                  👑 Administrator
                </span>
              )}

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div
            className="stat-card"
            onMouseEnter={() =>
              setHoveredCard(1)
            }
            onMouseLeave={() =>
              setHoveredCard(null)
            }
            onClick={() =>
              navigate("/orders")
            }
            style={{
              transform:
                hoveredCard === 1
                  ? "translateY(-6px)"
                  : "translateY(0)",
            }}
          >
            <h1>{orders.length}</h1>
            <p>Total Orders</p>
          </div>

          <div
            className="stat-card"
            onMouseEnter={() =>
              setHoveredCard(2)
            }
            onMouseLeave={() =>
              setHoveredCard(null)
            }
            onClick={() =>
              navigate("/cart")
            }
            style={{
              transform:
                hoveredCard === 2
                  ? "translateY(-6px)"
                  : "translateY(0)",
            }}
          >
            <h1>{cart.length}</h1>
            <p>Cart Items</p>
          </div>

          <div
            className="stat-card"
            onMouseEnter={() =>
              setHoveredCard(3)
            }
            onMouseLeave={() =>
              setHoveredCard(null)
            }
            onClick={() =>
              navigate("/wishlist")
            }
            style={{
              transform:
                hoveredCard === 3
                  ? "translateY(-6px)"
                  : "translateY(0)",
            }}
          >
            <h1>
              {wishlist?.length || 0}
            </h1>

            <p>
              Wishlist Items
            </p>
          </div>

          <div className="stat-card">

            <h1>✓</h1>

            <p>
              Account Status
            </p>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="actions-card">

          <h2>
            Quick Actions ⚡
          </h2>

          <div className="button-grid">

            <Link
              to="/address"
              className="action-btn"
            >
              ➕ Add Address
            </Link>

            <Link
              to="/saved-addresses"
              className="action-btn"
            >
              📍 Saved Addresses
            </Link>

            <Link
              to="/"
              className="action-btn"
            >
              🏠 Continue Shopping
            </Link>

            {user.isAdmin && (
              <Link
                to="/admin/dashboard"
                className="admin-btn"
              >
                👑 Admin Dashboard
              </Link>
            )}

          </div>

        </div>

      </div>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .profile-page{
        min-height:100vh;
        padding:40px;

        background:
        linear-gradient(
          to right,
          #0f172a,
          #1e3a8a
        );
      }

      /* PROFILE */

      .profile-card{
        max-width:1100px;
        margin:0 auto 30px auto;

        background:
        rgba(255,255,255,0.12);

        backdrop-filter:
        blur(18px);

        border:
        1px solid rgba(
          255,255,255,0.18
        );

        border-radius:28px;

        padding:32px;

        display:flex;
        gap:28px;
        align-items:center;

        transition:.35s ease;
      }

      .profile-card:hover{
        transform:
        translateY(-4px);

        box-shadow:
        0 12px 30px rgba(
          0,0,0,.25
        );
      }

      .avatar-circle{
        width:110px;
        height:110px;

        border-radius:50%;

        background:
        linear-gradient(
          135deg,
          #2563eb,
          #60a5fa
        );

        display:flex;
        justify-content:center;
        align-items:center;

        color:white;
        font-size:42px;
        font-weight:bold;

        box-shadow:
        0 10px 25px rgba(
          37,99,235,.35
        );
      }

      .profile-info{
        flex:1;
      }

      .profile-info h1{
        margin:0;
        color:white;
        font-size:34px;
      }

      .profile-info p{
        color:#cbd5e1;
        margin-top:8px;
      }

      .badge-row{
        display:flex;
        gap:12px;
        margin-top:14px;
        flex-wrap:wrap;
      }

      .active-badge{
        background:#16a34a;
        padding:8px 14px;
        border-radius:999px;
        color:white;
        font-size:14px;
      }

      .admin-badge{
        background:#f59e0b;
        padding:8px 14px;
        border-radius:999px;
        color:white;
        font-size:14px;
      }

      /* STATS */

      .stats-grid{
        max-width:1100px;
        margin:0 auto 30px auto;

        display:grid;

        grid-template-columns:
        repeat(auto-fit,minmax(220px,1fr));

        gap:20px;
      }

      .stat-card{
        background:
        rgba(255,255,255,0.12);

        backdrop-filter:
        blur(16px);

        border:
        1px solid rgba(
          255,255,255,.18
        );

        border-radius:22px;

        padding:28px;

        color:white;
        text-align:center;

        cursor:pointer;

        transition:.3s ease;
      }

      .stat-card:hover{
        box-shadow:
        0 12px 30px rgba(
          37,99,235,.30
        );
      }

      .stat-card h1{
        margin:0;
        font-size:38px;
      }

      .stat-card p{
        margin-top:10px;
        color:#cbd5e1;
      }

      /* ACTIONS */

      .actions-card{
        max-width:1100px;
        margin:auto;

        background:
        rgba(255,255,255,0.12);

        backdrop-filter:
        blur(18px);

        border:
        1px solid rgba(
          255,255,255,.18
        );

        border-radius:24px;

        padding:32px;
      }

      .actions-card h2{
        color:white;
        margin-top:0;
        margin-bottom:22px;
      }

      .button-grid{
        display:grid;

        grid-template-columns:
        repeat(auto-fit,minmax(220px,1fr));

        gap:16px;
      }

      .action-btn{
        text-decoration:none;

        background:
        linear-gradient(
          135deg,
          #2563eb,
          #1d4ed8
        );

        color:white;

        padding:15px;

        border-radius:14px;

        text-align:center;
        font-weight:bold;

        transition:.3s ease;
      }

      .action-btn:hover{
        transform:
        translateY(-3px);

        box-shadow:
        0 10px 24px rgba(
          37,99,235,.35
        );
      }

      .admin-btn{
        text-decoration:none;

        background:
        linear-gradient(
          135deg,
          #f59e0b,
          #d97706
        );

        color:white;

        padding:15px;

        border-radius:14px;

        text-align:center;
        font-weight:bold;

        transition:.3s ease;
      }

      .admin-btn:hover{
        transform:
        translateY(-3px);

        box-shadow:
        0 10px 24px rgba(
          245,158,11,.35
        );
      }

      /* MOBILE */

      @media(max-width:768px){

        .profile-page{
          padding:25px 16px;
        }

        .profile-card{
          flex-direction:column;
          text-align:center;
        }

        .profile-info h1{
          font-size:28px;
        }

      }

      `}</style>
    </>
  );
}