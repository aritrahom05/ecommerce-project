import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

export default function SavedAddresses() {
  const navigate =
    useNavigate();

  const [
    addresses,
    setAddresses,
  ] = useState([]);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(
          "http://localhost:5000/api/addresses",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await res.json();

      setAddresses(
        Array.isArray(
          data
        )
          ? data
          : []
      );
    };

  const deleteAddress =
    async (id) => {
      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        `http://localhost:5000/api/addresses/${id}`,
        {
          method:
            "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setAddresses(
        addresses.filter(
          (addr) =>
            addr._id !==
            id
        )
      );
    };

  return (
    <>
      <div className="saved-page">

        <div className="header-wrap">

          <div>
            <h1>
              Saved Addresses 📍
            </h1>

            <p>
              Manage all your delivery addresses securely.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/address"
              )
            }
            className="add-btn"
          >
            + Add Address
          </button>

        </div>

        {addresses.length ===
          0 && (
          <div className="empty-card">

            <h2>
              No Saved Addresses
            </h2>

            <p>
              Add an address to speed up checkout.
            </p>

          </div>
        )}

        <div className="address-grid">

          {addresses.map(
            (addr) => (
              <div
                key={
                  addr._id
                }
                className="address-card"
              >

                <div className="top-row">

                  <h3>
                    {
                      addr.fullName
                    }
                  </h3>

                  <span
                    className={
                      addr.addressType ===
                      "Work"
                        ? "badge work"
                        : "badge home"
                    }
                  >
                    {addr.addressType ||
                      "Home"}
                  </span>

                </div>

                <p className="muted">
                  📞{" "}
                  {addr.phone}
                </p>

                <p className="muted">
                  {
                    addr.addressLine1
                  }
                </p>

                <p className="muted">
                  {
                    addr.addressLine2
                  }
                </p>

                <p className="muted">
                  {addr.city},{" "}
                  {addr.state}
                </p>

                <p className="muted">
                  PIN:{" "}
                  {
                    addr.pincode
                  }
                </p>

                <div className="btn-row">

                  <button
                    onClick={() =>
                      navigate(
                        `/address/edit/${addr._id}`,
                        {
                          state:
                            {
                              address:
                                addr,
                            },
                        }
                      )
                    }
                    className="edit-btn"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteAddress(
                        addr._id
                      )
                    }
                    className="delete-btn"
                  >
                    Delete
                  </button>

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

.saved-page{
min-height:100vh;
padding:32px;

background:
linear-gradient(
to right,
#0f172a,
#1e3a8a
);
}

.header-wrap{
display:flex;
justify-content:
space-between;
align-items:center;
gap:20px;
flex-wrap:wrap;
margin-bottom:30px;
}

.header-wrap h1{
margin:0;
font-size:50px;
color:white;
}

.header-wrap p{
margin:8px 0 0 0;
color:#cbd5e1;
}

.add-btn{
border:none;
cursor:pointer;

padding:14px 22px;

border-radius:14px;

font-weight:700;
font-size:15px;
color:white;

background:
linear-gradient(
135deg,
#f97316,
#ea580c
);

transition:.25s ease;
}

.add-btn:hover{
transform:
translateY(-2px);

box-shadow:
0 10px 22px rgba(
249,115,22,.3
);
}

.empty-card{
background:
rgba(255,255,255,.12);

backdrop-filter:
blur(14px);

border:
1px solid rgba(
255,255,255,.15
);

padding:40px;
border-radius:22px;

color:white;
text-align:center;
margin-bottom:25px;
}

.address-grid{
display:grid;
grid-template-columns:
repeat(auto-fit,minmax(320px,1fr));
gap:22px;
}

.address-card{
background:
rgba(255,255,255,.12);

backdrop-filter:
blur(14px);

border:
1px solid rgba(
255,255,255,.15
);

padding:22px;
border-radius:22px;

color:white;

transition:.25s ease;
}

.address-card:hover{
transform:
translateY(-4px);

box-shadow:
0 10px 24px rgba(
37,99,235,.22
);
}

.top-row{
display:flex;
justify-content:
space-between;
align-items:center;
gap:10px;
margin-bottom:10px;
}

.top-row h3{
margin:0;
font-size:22px;
}

.badge{
padding:6px 12px;
border-radius:999px;
font-size:12px;
font-weight:700;
}

.home{
background:#16a34a;
}

.work{
background:#2563eb;
}

.muted{
color:#cbd5e1;
line-height:1.6;
margin:6px 0;
}

.btn-row{
display:flex;
gap:12px;
margin-top:18px;
}

.edit-btn,
.delete-btn{
flex:1;

border:none;
cursor:pointer;

padding:12px;

border-radius:12px;

font-weight:700;
color:white;

transition:.25s ease;
}

.edit-btn{
background:#2563eb;
}

.delete-btn{
background:#dc2626;
}

.edit-btn:hover,
.delete-btn:hover{
transform:
translateY(-2px);
}

@media(max-width:768px){

.saved-page{
padding:22px;
}

.header-wrap h1{
font-size:36px;
}

.address-grid{
grid-template-columns:
1fr;
}

.header-wrap{
flex-direction:column;
align-items:flex-start;
}

.add-btn{
width:100%;
}

}

`}</style>

    </>
  );
}