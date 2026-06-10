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

const buildFormAddress = (data = {}) => ({
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
  const { id } = useParams();
  const isEditing = Boolean(id);
  const selectedAddress =
    location.state?.address;

  const [address, setAddress] =
    useState(() =>
      selectedAddress
        ? buildFormAddress(
            selectedAddress
          )
        : emptyAddress
    );
  const [warning, setWarning] =
    useState("");

  useEffect(() => {
    if (!isEditing) return;

    if (selectedAddress) {
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

        if (!res.ok) {
          if (!selectedAddress) {
            navigate(
              "/saved-addresses"
            );
          }
          return;
        }

        const data =
          await res.json();

        setAddress(
          buildFormAddress(data)
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
      [name]: value,
    });
    setWarning("");
  };

  const validateAddress = () => {
    const missingField =
      requiredFields.find(
        (field) =>
          !String(
            address[field] ?? ""
          ).trim()
      );

    if (missingField) {
      setWarning(
        "Warning: fill all the required details."
      );
      return false;
    }

    return true;
  };

  const saveAddress =
    async () => {
      if (!validateAddress()) {
        return;
      }

      const token =
        localStorage.getItem(
          "token"
        );

      const res = await fetch(
        isEditing
          ? `http://localhost:5000/api/addresses/${id}`
          : "http://localhost:5000/api/addresses",
        {
          method: isEditing
            ? "PUT"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
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
          }),
        }
      );

      if (!res.ok) {
        const data =
          await res.json();

        setWarning(
          data.message ||
            "Warning: fill all the required details."
        );
        return;
      }

      navigate(
        "/saved-addresses"
      );
    };

  return (
    <div
      style={{
        background:
          "#f3f4f6",
        minHeight:
          "100vh",
        padding: "30px",
      }}
    >
      <div
        style={{
          background:
            "white",
          padding:
            "24px",
          borderRadius:
            "8px",
        }}
      >
        <h2>
          {isEditing
            ? "Edit Delivery Address"
            : "Add Delivery Address"}
        </h2>

        {warning && (
          <p style={warningStyle}>
            {warning}
          </p>
        )}

        <div
          style={{
            display:
              "grid",
            gap: "18px",
          }}
        >
          <input
            placeholder="Full Name (Required) *"
            value={
              address.fullName
            }
            onChange={(e) =>
              updateAddress(
                "fullName",
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Phone Number (Required) *"
            value={
              address.phone
            }
            onChange={(e) =>
              updateAddress(
                "phone",
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="Alternate Phone Number"
            value={
              address.alternatePhone
            }
            onChange={(e) =>
              updateAddress(
                "alternatePhone",
                e.target.value
              )
            }
            style={inputStyle}
          />

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "18px",
            }}
          >
            <input
              type="number"
              placeholder="Pincode (Required) *"
              value={
                address.pincode
              }
              onChange={(e) =>
                updateAddress(
                  "pincode",
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            />

            <input
              placeholder="City (Required) *"
              value={
                address.city
              }
              onChange={(e) =>
                updateAddress(
                  "city",
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            />
          </div>

          <input
            placeholder="State (Required) *"
            value={
              address.state
            }
            onChange={(e) =>
              updateAddress(
                "state",
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="House No., Building Name (Required) *"
            value={
              address.houseNo
            }
            onChange={(e) =>
              updateAddress(
                "houseNo",
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="Road Name, Area, Colony (Required) *"
            value={
              address.roadName
            }
            onChange={(e) =>
              updateAddress(
                "roadName",
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="Nearby famous shop, mall, or landmark"
            value={
              address.landmark
            }
            onChange={(e) =>
              updateAddress(
                "landmark",
                e.target.value
              )
            }
            style={inputStyle}
          />

          <div>
            <p>
              Type of Address
            </p>

                      <button
                          type="button"
                          onClick={() =>
                              updateAddress(
                                  "addressType",
                                  "Home"
                              )
                          }
                          style={{
                              ...typeButton,
                              background:
                                  address.addressType === "Home"
                                      ? "#eff6ff"
                                      : "white",
                              borderColor:
                                  address.addressType === "Home"
                                      ? "#2563eb"
                                      : "#d1d5db",
                          }}
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
                          style={{
                              ...typeButton,
                              marginLeft: "10px",
                              background:
                                  address.addressType === "Work"
                                      ? "#eff6ff"
                                      : "white",
                              borderColor:
                                  address.addressType === "Work"
                                      ? "#2563eb"
                                      : "#d1d5db",
                          }}
                      >
                          Work
                      </button>
          </div>

          <button
            onClick={
              saveAddress
            }
            style={
              saveButton
            }
          >
            {isEditing
              ? "Update Address"
              : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "16px",
  border:
    "1px solid #d1d5db",
  borderRadius:
    "4px",
  fontSize: "16px",
};

const saveButton = {
  background:
    "#f97316",
  color: "white",
  border: "none",
  padding: "16px",
  borderRadius:
    "10px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const typeButton = {
  padding:
    "12px 24px",
  border:
    "1px solid #d1d5db",
  borderRadius:
    "999px",
  background:
    "white",
  cursor: "pointer",
};

const warningStyle = {
  background: "#fef3c7",
  color: "#92400e",
  padding: "12px",
  borderRadius: "8px",
  fontWeight: "bold",
};
