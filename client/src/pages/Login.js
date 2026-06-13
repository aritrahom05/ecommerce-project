import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login({
  user,
  setUser,
  setCart,
  setWishlist,
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  if (user) {
    return <Navigate to="/" />;
  }

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

        localStorage.setItem(
          "token",
          data.token
        );

        const savedCart =
          localStorage.getItem(
            `cart_${data.user._id}`
          );

        setCart(
          savedCart
            ? JSON.parse(savedCart)
            : []
        );

        const savedWishlist =
          localStorage.getItem(
            `wishlist_${data.user._id}`
          );

        if (setWishlist) {
          setWishlist(
            savedWishlist
              ? JSON.parse(savedWishlist)
              : []
          );
        }
      } else {
        setMessage(
          "Invalid email or password"
        );
      }
    } catch (err) {
      setMessage("Login failed");
    }
  };

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
          email:
            googleUser.email,
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

        const savedWishlist =
          localStorage.getItem(
            `wishlist_${googleUser.uid}`
          );

        if (setWishlist) {
          setWishlist(
            savedWishlist
              ? JSON.parse(savedWishlist)
              : []
          );
        }
      } catch (err) {
        console.log(err);

        setMessage(
          "Google sign-in failed"
        );
      }
    };

  return (
    <>
      <div className="login-page">

        <div className="login-card">

          <h1>
            Welcome Back 👋
          </h1>

          <p className="sub-text">
            Login to continue your
            premium shopping experience.
          </p>

          {message && (
            <div className="error-box">
              {message}
            </div>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="premium-input"
          />

          <div className="password-wrap">

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
              className="premium-input password-input"
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
            onClick={handleLogin}
            className="login-btn"
          >
            Login
          </button>

          <p className="forgot-wrap">
            <Link
              to="/forgot-password"
              className="auth-link"
            >
              Forgot Password?
            </Link>
          </p>

          <div className="divider">
            OR
          </div>

          <button
            onClick={
              handleGoogleLogin
            }
            className="google-btn"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
            />

            Continue with Google
          </button>

          <p className="register-wrap">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="auth-link"
            >
              Create account
            </Link>
          </p>

        </div>
      </div>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .login-page{
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

      .login-card{
        width:430px;
        padding:42px;

        background:
        rgba(255,255,255,0.06);

        backdrop-filter:blur(18px);

        border-radius:28px;

        border:
        1px solid rgba(
          255,255,255,0.08
        );

        box-shadow:
        0 15px 40px rgba(
          0,0,0,.35
        );

        color:white;

        transition:.35s ease;
      }

      .login-card:hover{
        transform:
        translateY(-4px);
      }

      .login-card h1{
        margin:0 0 10px 0;
        font-size:38px;
      }

      .sub-text{
        color:#94a3b8;
        margin-bottom:28px;
        line-height:1.6;
      }

      .error-box{
        background:
        rgba(239,68,68,.15);
        color:#fca5a5;
        padding:12px;
        border-radius:12px;
        margin-bottom:18px;
        font-size:14px;
      }

      .premium-input{
        width:100%;
        padding:16px;
        margin-bottom:16px;

        border:none;
        outline:none;

        border-radius:14px;

        background:
        rgba(255,255,255,0.08);

        color:white;
        font-size:15px;

        border:
        1px solid rgba(
          255,255,255,0.06
        );

        transition:.3s ease;
      }

      .premium-input:focus{
        border:
        1px solid #3b82f6;

        box-shadow:
        0 0 20px rgba(
          59,130,246,.25
        );
      }

      .premium-input::placeholder{
        color:#94a3b8;
      }

      .password-wrap{
        position:relative;
      }

      .password-input{
        margin-bottom:0;
      }

      .eye-icon{
        position:absolute;
        right:18px;
        top:50%;
        transform:
        translateY(-50%);

        cursor:pointer;
        color:#94a3b8;
        font-size:18px;

        transition:.3s;
      }

      .eye-icon:hover{
        color:white;
        transform:
        translateY(-50%)
        scale(1.1);
      }

      .login-btn{
        width:100%;
        margin-top:18px;
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

      .login-btn:hover{
        transform:
        translateY(-2px);

        box-shadow:
        0 10px 25px rgba(
          37,99,235,.3
        );
      }

      .forgot-wrap{
        text-align:right;
        margin-top:12px;
      }

      .auth-link{
        color:#cbd5e1;
        text-decoration:none;
        transition:.3s;
      }

      .auth-link:hover{
        color:white;
      }

      .divider{
        text-align:center;
        margin:24px 0;
        color:#64748b;
        font-weight:700;
      }

      .google-btn{
        width:100%;
        padding:15px;

        border:none;
        cursor:pointer;

        border-radius:14px;

        font-weight:600;
        font-size:15px;

        display:flex;
        align-items:center;
        justify-content:center;
        gap:12px;

        background:
        rgba(255,255,255,0.08);

        color:white;

        transition:.3s ease;
      }

      .google-btn img{
        width:22px;
        height:22px;
      }

      .google-btn:hover{
        transform:
        translateY(-2px);

        background:
        rgba(255,255,255,0.12);
      }

      .register-wrap{
        margin-top:24px;
        text-align:center;
        color:#94a3b8;
      }

      @media(max-width:768px){

        .login-card{
          width:100%;
          padding:28px;
        }

        .login-card h1{
          font-size:30px;
        }

      }

      `}</style>
    </>
  );
}