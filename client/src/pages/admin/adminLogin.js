import { useState } from "react";
import { Navigate } from "react-router-dom";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function AdminLogin({
  user,
  setUser,
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

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

  const handleAdminLogin =
    async (e) => {
      e.preventDefault();

      if (
        !email ||
        !password
      ) {
        setMessage(
          "Please enter admin email and password."
        );
        return;
      }

      try {
        const res =
          await fetch(
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

        const data =
          await res.json();

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
    <>
      <div className="admin-page">

        <form
          className="admin-card"
          onSubmit={
            handleAdminLogin
          }
        >

          <h1>
            Admin Control 🛡️
          </h1>

          <p className="sub-text">
            Restricted access for
            administrators only.
          </p>

          {message && (
            <div className="error-box">
              {message}
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
  <input
    type="email"
    placeholder="Admin Email"
    value={email}
    onChange={(e) =>
      setEmail(e.target.value)
    }
    className="premium-input"
  />
</div>

          <div className="password-wrap">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="premium-input"
style={{ marginBottom: "16px" }}
            />

            <span
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="eye-icon"
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="admin-btn"
          >
            Access Dashboard
          </button>

        </form>
      </div>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .admin-page{
        min-height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        padding:20px;

        background:
        linear-gradient(
          to right,
          #0f172a,
          #1e3a8a
        );
      }

      .admin-card{
        width:430px;
        padding:42px;

        background:
        rgba(255,255,255,0.12);

        backdrop-filter:
        blur(18px);

        border-radius:28px;

        border:
        1px solid rgba(
          255,255,255,0.18
        );

        box-shadow:
        0 15px 40px rgba(
          0,0,0,.35
        );

        color:white;

        transition:.35s ease;
      }

      .admin-card:hover{
        transform:
        translateY(-4px);
      }

      .admin-card h1{
        margin:0 0 10px 0;
        font-size:36px;
      }

      .sub-text{
        color:#cbd5e1;
        margin-bottom:28px;
        line-height:1.6;
      }

      .error-box{
        background:
        rgba(239,68,68,.15);

        border:
        1px solid rgba(
          239,68,68,.25
        );

        color:#fecaca;

        padding:12px;
        border-radius:12px;
        margin-bottom:18px;
        font-size:14px;
      }

      .password-wrap{
        position:relative;
        margin-bottom:18px;
      }

      .premium-input{
        width:100%;
        padding:16px;

        border:none;
        outline:none;

        border-radius:14px;

        background:
        rgba(255,255,255,0.15);

        color:white;
        font-size:15px;

        border:
        1px solid rgba(
          255,255,255,0.10
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
          59,130,246,.25
        );
      }

      .eye-icon{
        position:absolute;
        right:16px;
        top:50%;
        transform:
        translateY(-50%);
        cursor:pointer;
        color:#cbd5e1;
        transition:.3s;
      }

      .eye-icon:hover{
        color:white;
        transform:
        translateY(-50%)
        scale(1.1);
      }

      .admin-btn{
        width:100%;
        padding:15px;

        border:none;
        cursor:pointer;

        border-radius:14px;

        font-weight:700;
        font-size:16px;
        color:white;

        background:
        linear-gradient(
          135deg,
          #2563eb,
          #1d4ed8
        );

        transition:.3s ease;
      }

      .admin-btn:hover{
        transform:
        translateY(-2px);

        box-shadow:
        0 10px 25px rgba(
          37,99,235,.35
        );
      }

      @media(max-width:768px){

        .admin-card{
          width:100%;
          padding:28px;
        }

        .admin-card h1{
          font-size:30px;
        }

      }

      `}</style>
    </>
  );
}