import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function AdminLogin({
  user,
  setUser,
}) {
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [message, setMessage] =
    useState("");

  if (user?.isAdmin) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage(
        "Please enter admin email and password."
      );
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (
        !res.ok ||
        !data.user ||
        !data.user.isAdmin
      ) {
        setMessage(
          "Invalid admin email or password."
        );
        return;
      }

      setUser(data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "token",
        data.token
      );
    } catch (err) {
      setMessage(
        "Admin login failed. Please try again."
      );
    }
  };

  return (
    <div style={pageStyle}>
      <form
        style={cardStyle}
        onSubmit={handleAdminLogin}
      >
        <h1 style={titleStyle}>
          Admin Login
        </h1>
        <p style={subtitleStyle}>
          Sign in with your admin email and password.
        </p>

        {message && (
          <p style={messageStyle}>
            {message}
          </p>
        )}

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <button
          type="submit"
          style={buttonStyle}
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f3f4f6",
  padding: "24px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "white",
  padding: "32px",
  borderRadius: "12px",
  boxShadow:
    "0 4px 16px rgba(15,23,42,0.12)",
};

const titleStyle = {
  margin: "0 0 8px",
  color: "#111827",
};

const subtitleStyle = {
  margin: "0 0 24px",
  color: "#64748b",
  lineHeight: "1.5",
};

const messageStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "10px 12px",
  borderRadius: "8px",
  marginBottom: "16px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  marginBottom: "14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "13px 14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};
