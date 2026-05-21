import { useState } from "react";

import {
  Link,
  Navigate,
} from "react-router-dom";

import {
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  provider,
} from "../firebase";

export default function Login({
  user,
  setUser,
  setCart,
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  // ALREADY LOGGED IN
  if (user) {
    return <Navigate to="/profile" />;
  }

  // NORMAL LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage(
        "Please fill all fields"
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

      if (data.user) {
        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // LOAD CART
        const savedCart =
          localStorage.getItem(
            `cart_${data.user._id}`
          );

        setCart(
          savedCart
            ? JSON.parse(savedCart)
            : []
        );
      } else {
        setMessage(
          "Invalid email or password"
        );
      }
    } catch (err) {
      setMessage("Login failed");
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin =
    async () => {
      try {
        const result =
          await signInWithPopup(
            auth,
            provider
          );

        const googleUser =
          result.user;

        const userData = {
          _id: googleUser.uid,
          name:
            googleUser.displayName,
          email: googleUser.email,
        };

        setUser(userData);

        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );

        const savedCart =
          localStorage.getItem(
            `cart_${googleUser.uid}`
          );

        setCart(
          savedCart
            ? JSON.parse(savedCart)
            : []
        );
      } catch (err) {
        console.log(err);

        setMessage(
          "Google sign-in failed"
        );
      }
    };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          backdropFilter: "blur(12px)",
          border:
            "1px solid rgba(255,255,255,0.2)",
          borderRadius: "24px",
          padding: "40px",
          color: "white",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            marginBottom: "10px",
            fontSize: "36px",
          }}
        >
          Welcome Back 👋
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "30px",
          }}
        >
          Login to continue shopping
        </p>

        {/* MESSAGE */}
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

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          style={loginButton}
        >
          Login
        </button>

        {/* OR */}
        <div
          style={{
            textAlign: "center",
            margin: "22px 0",
            color: "#cbd5e1",
            fontWeight: "bold",
          }}
        >
          OR
        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogleLogin}
          style={googleButton}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            style={{
              width: "22px",
              height: "22px",
            }}
          />

          Continue with Google
        </button>

        {/* REGISTER */}
        <p
          style={{
            marginTop: "25px",
            textAlign: "center",
            color: "#cbd5e1",
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "15px",
  background:
    "rgba(255,255,255,0.15)",
  color: "white",
};

const loginButton = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "0.3s",
};

const googleButton = {
  width: "100%",
  padding: "14px",
  background: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.15)",
};