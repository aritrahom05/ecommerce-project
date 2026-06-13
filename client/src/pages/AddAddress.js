import {
  useEffect,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const emptyAddress = {
  fullName: "",
  phone: "",
  alternatePhone: "",
  houseNo: "",
  roadName: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  addressType: "Home",
};

const requiredFields = [
  "fullName",
  "phone",
  "pincode",
  "state",
  "city",
  "houseNo",
  "roadName",
];

const buildFormAddress = (
  data = {}
) => ({
  fullName:
    data.fullName || "",
  phone: data.phone || "",
  alternatePhone:
    data.alternatePhone || "",
  houseNo:
    data.houseNo ||
    data.addressLine1 ||
    "",
  roadName:
    data.roadName ||
    data.addressLine2 ||
    "",
  landmark:
    data.landmark || "",
  city: data.city || "",
  state: data.state || "",
  pincode:
    data.pincode || "",
  addressType:
    data.addressType ||
    "Home",
});

export default function AddAddress() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { id } =
    useParams();

  const isEditing =
    Boolean(id);

  const selectedAddress =
    location.state
      ?.address;

  const [
    address,
    setAddress,
  ] = useState(() =>
    selectedAddress
      ? buildFormAddress(
          selectedAddress
        )
      : emptyAddress
  );

  const [
    warning,
    setWarning,
  ] = useState("");

  useEffect(() => {
    if (!isEditing)
      return;

    if (
      selectedAddress
    ) {
      setAddress(
        buildFormAddress(
          selectedAddress
        )
      );
    }

    const loadAddress =
      async () => {
        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            `http://localhost:5000/api/addresses/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          !res.ok
        ) {
          if (
            !selectedAddress
          ) {
            navigate(
              "/saved-addresses"
            );
          }
          return;
        }

        const data =
          await res.json();

        setAddress(
          buildFormAddress(
            data
          )
        );
      };

    loadAddress();
  }, [
    id,
    isEditing,
    navigate,
    selectedAddress,
  ]);

  const updateAddress = (
    name,
    value
  ) => {
    setAddress({
      ...address,
      [name]:
        value,
    });

    setWarning("");
  };

  const validateAddress =
    () => {
      const missingField =
        requiredFields.find(
          (
            field
          ) =>
            !String(
              address[
                field
              ] ??
                ""
            ).trim()
        );

      if (
        missingField
      ) {
        setWarning(
          "Please fill all required fields."
        );
        return false;
      }

      return true;
    };

  const saveAddress =
    async () => {
      if (
        !validateAddress()
      )
        return;

      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(
          isEditing
            ? `http://localhost:5000/api/addresses/${id}`
            : "http://localhost:5000/api/addresses",
          {
            method:
              isEditing
                ? "PUT"
                : "POST",

            headers:
              {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },

            body: JSON.stringify(
              {
                fullName:
                  address.fullName,

                phone:
                  Number(
                    address.phone
                  ),

                addressLine1:
                  address.houseNo,

                addressLine2:
                  address.roadName,

                alternatePhone:
                  address.alternatePhone,

                landmark:
                  address.landmark,

                addressType:
                  address.addressType,

                city:
                  address.city,

                state:
                  address.state,

                pincode:
                  Number(
                    address.pincode
                  ),
              }
            ),
          }
        );

      if (
        !res.ok
      ) {
        const data =
          await res.json();

        setWarning(
          data.message ||
            "Something went wrong."
        );

        return;
      }

      navigate(
        "/saved-addresses"
      );
    };

  return (
    <>
      <div className="address-page">

        <div className="address-card">

          <h1>
            {isEditing
              ? "Edit Address 📍"
              : "Add Address 📦"}
          </h1>

          <p className="sub-text">
            Securely save delivery details for faster checkout.
          </p>

          {warning && (
            <div className="warning-box">
              {warning}
            </div>
          )}

          <div className="form-grid">

            <input
              placeholder="Full Name *"
              value={
                address.fullName
              }
              onChange={(e) =>
                updateAddress(
                  "fullName",
                  e.target.value
                )
              }
              className="premium-input"
            />

            <input
              type="number"
              placeholder="Phone Number *"
              value={
                address.phone
              }
              onChange={(e) =>
                updateAddress(
                  "phone",
                  e.target.value
                )
              }
              className="premium-input"
            />

            <input
              placeholder="Alternate Phone"
              value={
                address.alternatePhone
              }
              onChange={(e) =>
                updateAddress(
                  "alternatePhone",
                  e.target.value
                )
              }
              className="premium-input"
            />

            <div className="double-row">
                            <input
                type="number"
                placeholder="Pincode *"
                value={
                  address.pincode
                }
                onChange={(e) =>
                  updateAddress(
                    "pincode",
                    e.target.value
                  )
                }
                className="premium-input"
              />

              <input
                placeholder="City *"
                value={
                  address.city
                }
                onChange={(e) =>
                  updateAddress(
                    "city",
                    e.target.value
                  )
                }
                className="premium-input"
              />

            </div>

            <input
              placeholder="State *"
              value={
                address.state
              }
              onChange={(e) =>
                updateAddress(
                  "state",
                  e.target.value
                )
              }
              className="premium-input"
            />

            <input
              placeholder="House No / Building *"
              value={
                address.houseNo
              }
              onChange={(e) =>
                updateAddress(
                  "houseNo",
                  e.target.value
                )
              }
              className="premium-input"
            />

            <input
              placeholder="Road / Area / Colony *"
              value={
                address.roadName
              }
              onChange={(e) =>
                updateAddress(
                  "roadName",
                  e.target.value
                )
              }
              className="premium-input"
            />

            <input
              placeholder="Landmark"
              value={
                address.landmark
              }
              onChange={(e) =>
                updateAddress(
                  "landmark",
                  e.target.value
                )
              }
              className="premium-input"
            />

            <div className="address-type">

              <p>
                Address Type
              </p>

              <div className="type-row">

                <button
                  type="button"
                  onClick={() =>
                    updateAddress(
                      "addressType",
                      "Home"
                    )
                  }
                  className={
                    address.addressType ===
                    "Home"
                      ? "type-btn active"
                      : "type-btn"
                  }
                >
                  Home
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateAddress(
                      "addressType",
                      "Work"
                    )
                  }
                  className={
                    address.addressType ===
                    "Work"
                      ? "type-btn active"
                      : "type-btn"
                  }
                >
                  Work
                </button>

              </div>

            </div>

            <button
              onClick={
                saveAddress
              }
              className="save-btn"
            >
              {isEditing
                ? "Update Address"
                : "Save Address"}
            </button>

          </div>

        </div>

      </div>

<style>{`

*{
box-sizing:border-box;
}

.address-page{
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
padding:30px;

background:
linear-gradient(
to right,
#0f172a,
#1e3a8a
);
}

.address-card{
width:750px;
max-width:100%;

background:
rgba(255,255,255,.12);

backdrop-filter:
blur(16px);

border:
1px solid rgba(
255,255,255,.18
);

border-radius:28px;
padding:38px;
color:white;

box-shadow:
0 15px 40px rgba(
0,0,0,.35
);
}

.address-card h1{
margin:0 0 8px 0;
font-size:38px;
}

.sub-text{
color:#cbd5e1;
margin-bottom:28px;
line-height:1.6;
}

.warning-box{
background:
rgba(239,68,68,.15);

border:
1px solid rgba(
239,68,68,.25
);

padding:12px;
border-radius:12px;
margin-bottom:18px;
color:#fecaca;
font-size:14px;
}

.form-grid{
display:grid;
gap:16px;
}

.double-row{
display:grid;
grid-template-columns:
1fr 1fr;
gap:16px;
}

.premium-input{
width:100%;
padding:15px;

border:none;
outline:none;

border-radius:14px;

background:
rgba(255,255,255,.15);

color:white;
font-size:15px;

border:
1px solid rgba(
255,255,255,.10
);

transition:.3s ease;
}

.premium-input::placeholder{
color:#cbd5e1;
}

.premium-input:focus{
border:
1px solid #3b82f6;

box-shadow:
0 0 20px rgba(
59,130,246,.22
);
}

.address-type p{
margin:4px 0 12px 0;
font-weight:600;
}

.type-row{
display:flex;
gap:12px;
}

.type-btn{
padding:12px 24px;

border-radius:999px;
border:
1px solid rgba(
255,255,255,.18
);

background:
rgba(255,255,255,.08);

color:white;
cursor:pointer;

transition:.25s ease;
}

.type-btn.active{
background:
rgba(37,99,235,.22);

border:
1px solid #2563eb;

box-shadow:
0 0 14px rgba(
37,99,235,.2
);
}

.type-btn:hover{
transform:
translateY(-2px);
}

.save-btn{
width:100%;
padding:16px;

border:none;
cursor:pointer;

border-radius:14px;

font-weight:700;
font-size:17px;
color:white;

background:
linear-gradient(
135deg,
#f97316,
#ea580c
);

transition:.3s ease;
margin-top:8px;
}

.save-btn:hover{
transform:
translateY(-2px);

box-shadow:
0 10px 24px rgba(
249,115,22,.35
);
}

@media(max-width:768px){

.address-card{
padding:26px;
}

.address-card h1{
font-size:30px;
}

.double-row{
grid-template-columns:
1fr;
}

.type-row{
flex-direction:column;
}

}

`}</style>

    </>
  );
}