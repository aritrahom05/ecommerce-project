import { useState } from "react";

import {
  Link,
  Navigate,
} from "react-router-dom";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function Register({
  user,
}) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  // ALREADY LOGGED IN
  if (user) {
    return <Navigate to="/profile" />;
  }

  const hasLength =
    password.length >= 8;

  const hasUppercase =
    /[A-Z]/.test(password);

  const hasLowercase =
    /[a-z]/.test(password);

  const hasNumber =
    /\d/.test(password);

  const hasSpecial =
  /[@$!%*?&_]/.test(password);

  const strengthScore = [
    hasLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  const strengthLabel =
    strengthScore <= 2
      ? "🔴 Weak"
      : strengthScore <= 4
      ? "🟡 Medium"
      : "🟢 Strong";

  // REGISTER
  const handleRegister = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setMessage(
        "Please fill all fields"
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage(
        "Please enter a valid email address"
      );
      return;
    }

    const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must contain at least 8 characters, 1 uppercase letter, 1 number and 1 special character"
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setMessage(
        "Passwords do not match"
      );
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data =
        await res.json();

      if (
        data._id ||
        data.message
      ) {
        setMessage(
          "Account created successfully!"
        );

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setMessage(
        "Something went wrong"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        background:
          "linear-gradient(to right, #0f172a, #1e3a8a)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "420px",
          background:
            "rgba(255,255,255,0.12)",
          backdropFilter:
            "blur(12px)",
          border:
            "1px solid rgba(255,255,255,0.2)",
          borderRadius:
            "24px",
          padding: "40px",
          color: "white",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            fontSize: "36px",
          }}
        >
          Create Account 🚀
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "30px",
          }}
        >
          Join Ecart and start shopping
        </p>

        {message && (
          <p
            style={{
              background:
                "rgba(239,68,68,0.2)",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {message}
          </p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <div
  style={{
    position: "relative",
    marginBottom: "16px",
  }}
>
  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    placeholder="Password"
    value={password}
    onChange={(e) =>
      setPassword(
        e.target.value
      )
    }
    style={{
      ...inputStyle,
      marginBottom: 0,
    }}
  />

  <span
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
    style={{
      position:
        "absolute",
      right: "15px",
      top: "50%",
      transform:
        "translateY(-50%)",
      cursor:
        "pointer",
      color:
        "#cbd5e1",
      fontSize: "18px",
    }}
  >
    {showPassword ? (
      <FaEyeSlash />
    ) : (
      <FaEye />
    )}
  </span>
</div>

        <div
          style={{
            marginBottom: "18px",
            color: "#cbd5e1",
            fontSize: "14px",
          }}
        >
          <strong>
            Password Strength:
          </strong>{" "}
          {strengthLabel}

          <div>
            {hasLength
              ? "✅"
              : "❌"}{" "}
            At least 8 characters
          </div>

          <div>
            {hasUppercase
              ? "✅"
              : "❌"}{" "}
            One uppercase letter
          </div>

          <div>
            {hasLowercase
              ? "✅"
              : "❌"}{" "}
            One lowercase letter
          </div>

          <div>
            {hasNumber
              ? "✅"
              : "❌"}{" "}
            One number
          </div>

          <div>
            {hasSpecial
              ? "✅"
              : "❌"}{" "}
            One special character
          </div>
        </div>

        <div
  style={{
    position: "relative",
    marginBottom: "16px",
  }}
>
  <input
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    placeholder="Confirm Password"
    value={
      confirmPassword
    }
    onChange={(e) =>
      setConfirmPassword(
        e.target.value
      )
    }
    style={{
      ...inputStyle,
      marginBottom: 0,
    }}
  />

  <span
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform:
        "translateY(-50%)",
      cursor: "pointer",
      color: "#cbd5e1",
      fontSize: "18px",
    }}
  >
    {showConfirmPassword ? (
      <FaEyeSlash />
    ) : (
      <FaEye />
    )}
  </span>
</div>

        <button
          onClick={
            handleRegister
          }
          style={
            registerButton
          }
        >
          Create Account
        </button>

        <p
          style={{
            marginTop: "25px",
            textAlign: "center",
            color: "#cbd5e1",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  boxSizing: "border-box",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "15px",
  background:
    "rgba(255,255,255,0.15)",
  color: "white",
};


const registerButton = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};