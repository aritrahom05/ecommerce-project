import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <>
      <div className="admin-page">

        <div className="admin-container">

          {/* HEADER */}
          <h1 className="admin-title">
            Store Control Center 
          </h1>

          <p className="admin-subtitle">
            Monitor products, orders and manage your marketplace.
          </p>

          

          {/* GRID */}
          <div className="admin-grid">

            <Link
              to="/admin/products"
              className="admin-card"
            >
              <div className="icon-circle blue">
                📦
              </div>

              <h2>Manage Products</h2>

              <p>
                Add new products, edit pricing,
                update stock and remove listings.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="admin-card"
            >
              <div className="icon-circle orange">
                🚚
              </div>

              <h2>Manage Orders</h2>

              <p>
                View customer orders, addresses,
                payment details and delivery status.
              </p>
            </Link>

          </div>

        </div>
      </div>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .admin-page{
        min-height:100vh;
        padding:70px 50px;

        background:
        linear-gradient(
          to right,
          #0f172a,
          #1e3a8a
        );
      }

      .admin-container{
        max-width:1200px;
        margin:0 auto;
      }

      .admin-title{
        color:white;
        font-size:48px;
        margin-bottom:12px;
      }

      .admin-subtitle{
        color:#cbd5e1;
        font-size:18px;
        margin-bottom:55px;
      }

      

      /* MAIN GRID */

      .admin-grid{
        display:grid;
        grid-template-columns:
        repeat(auto-fit,minmax(330px,1fr));

        gap:28px;
      }

      .admin-card{
        background:
        rgba(255,255,255,0.12);

        backdrop-filter:
        blur(18px);

        border:
        1px solid rgba(
          255,255,255,0.18
        );

        border-radius:26px;

        padding:34px;

        text-decoration:none;
        color:white;

        box-shadow:
        0 10px 30px rgba(
          0,0,0,.25
        );

        transition:.35s ease;
      }

      .admin-card:hover{
        transform:
        translateY(-6px);

        border:
        1px solid rgba(
          59,130,246,.5
        );

        box-shadow:
        0 14px 35px rgba(
          37,99,235,.25
        );
      }

      .icon-circle{
        width:70px;
        height:70px;
        border-radius:50%;

        display:flex;
        align-items:center;
        justify-content:center;

        font-size:32px;
        margin-bottom:22px;
      }

      .blue{
        background:
        rgba(37,99,235,.25);
      }

      .orange{
        background:
        rgba(249,115,22,.25);
      }

      .admin-card h2{
        margin:0 0 14px 0;
        font-size:28px;
      }

      .admin-card p{
        margin:0;
        line-height:1.7;
        color:#cbd5e1;
        font-size:15px;
      }

      @media(max-width:768px){

        .admin-page{
          padding:40px 20px;
        }

        .admin-title{
          font-size:36px;
        }

        .admin-subtitle{
          font-size:16px;
        }

      }

      `}</style>
    </>
  );
}