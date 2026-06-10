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

  const [addresses,
    setAddresses] =
    useState([]);

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
        Array.isArray(data)
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
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setAddresses(
        addresses.filter(
          (addr) =>
            addr._id !== id
        )
      );
    };

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>
        Saved Addresses
      </h1>

      {addresses.map(
        (addr) => (
          <div
            key={addr._id}
            style={{
              border:
                "1px solid #ddd",
              padding:
                "15px",
              marginBottom:
                "15px",
              borderRadius:
                "10px",
            }}
          >
            <h4>
              {
                addr.fullName
              }
            </h4>

            <p>
              {addr.phone}
            </p>

            <p>
              {
                addr.addressLine1
              }
            </p>

            <p>
              {addr.city},{" "}
              {addr.state}
            </p>

            <p>
              {addr.pincode}
            </p>

            <button
              onClick={() =>
                navigate(
                  `/address/edit/${addr._id}`,
                  {
                    state: {
                      address: addr,
                    },
                  }
                )
              }
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteAddress(
                  addr._id
                )
              }
              style={{
                marginLeft:
                  "10px",
              }}
            >
              Delete
            </button>
          </div>
        )
      )}

      <button
        onClick={() =>
          navigate("/address")
        }
        style={{
          background:
            "#f97316",
          color: "white",
          border: "none",
          padding:
            "14px 22px",
          borderRadius:
            "8px",
          fontSize: "16px",
          fontWeight:
            "bold",
          cursor: "pointer",
        }}
      >
        Add Address
      </button>
    </div>
  );
}
