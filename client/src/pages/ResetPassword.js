import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import { useState } from "react";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function ResetPassword() {
  const { email } =
    useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

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

  const [loading, setLoading] =
    useState(false);

  // IMPORTANT: hooks first, then conditional
  if (
    !location.state?.verified
  ) {
    return (
      <Navigate
        to="/forgot-password"
      />
    );
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

  const resetPassword =
    async () => {
      if (!password) {
        setMessage(
          "Please enter a new password"
        );
        return;
      }

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_]).{8,}$/;

      if (
        !passwordRegex.test(
          password
        )
      ) {
        setMessage(
          "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
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
        setLoading(true);

        await fetch(
          "http://localhost:5000/api/auth/reset-password",
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

        setMessage(
          "Password updated successfully!"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (err) {
        setMessage(
          "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <div className="reset-page">

        <div className="reset-card">

          <h2>
            Create New Password 🔒
          </h2>

          <p className="sub-text">
            Secure your account with
            a fresh password.
          </p>

          {message && (
            <div
              className={
                message.includes(
                  "successfully"
                )
                  ? "success-box"
                  : "error-box"
              }
            >
              {message}
            </div>
          )}

          <div className="password-wrap">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="New Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="premium-input"
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

          <div className="strength-box">
            <strong>
              Password Strength:
            </strong>{" "}
            {strengthLabel}

            <div>
              {hasLength
                ? "✅"
                : "❌"} At least 8 characters
            </div>

            <div>
              {hasUppercase
                ? "✅"
                : "❌"} One uppercase letter
            </div>

            <div>
              {hasLowercase
                ? "✅"
                : "❌"} One lowercase letter
            </div>

            <div>
              {hasNumber
                ? "✅"
                : "❌"} One number
            </div>

            <div>
              {hasSpecial
                ? "✅"
                : "❌"} One special character
            </div>
          </div>

          <div className="password-wrap">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="x7k_secure_field"
autoComplete="off"
data-form-type="other"
              placeholder="Confirm Password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="premium-input"
            />

            <span
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="eye-icon"
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
              resetPassword
            }
            disabled={loading}
            className="save-btn"
          >
            {loading
              ? "Saving..."
              : "Save Password"}
          </button>

        </div>
      </div>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .reset-page{
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

      .reset-card{
        width:440px;
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

      .reset-card:hover{
        transform:
        translateY(-4px);
      }

      .reset-card h1{
        margin:0 0 10px 0;
        font-size:34px;
      }

      .sub-text{
        color:#cbd5e1;
        margin-bottom:24px;
        line-height:1.6;
      }

      .error-box,
      .success-box{
        padding:12px;
        border-radius:12px;
        margin-bottom:18px;
        font-size:14px;
      }

      .error-box{
        background:
        rgba(239,68,68,.15);
        border:
        1px solid rgba(
          239,68,68,.25
        );
        color:#fecaca;
      }

      .success-box{
        background:
        rgba(34,197,94,.15);
        border:
        1px solid rgba(
          34,197,94,.25
        );
        color:#bbf7d0;
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

      .strength-box{
        background:
        rgba(255,255,255,0.06);
        padding:14px;
        border-radius:14px;
        margin-bottom:18px;
        color:#cbd5e1;
        font-size:14px;
        line-height:1.8;
      }

      .save-btn{
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

      .save-btn:hover{
        transform:
        translateY(-2px);
        box-shadow:
        0 10px 25px rgba(
          37,99,235,.35
        );
      }

      .save-btn:disabled{
        opacity:.7;
        cursor:not-allowed;
      }

      @media(max-width:768px){
        .reset-card{
          width:100%;
          padding:28px;
        }

        .reset-card h1{
          font-size:28px;
        }
      }

      `}</style>
    </>
  );
}