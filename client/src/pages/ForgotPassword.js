import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const handleSubmit =
    async () => {
      if (!email) {
        setMessage(
          "Please enter your email"
        );
        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(email)
      ) {
        setMessage(
          "Please enter a valid email address"
        );
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          "http://localhost:5000/api/auth/check-email",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          }
        );

        const data =
          await res.json();

        setLoading(false);

        if (data.success) {
          navigate(
            `/reset-password/${email}`,
            {
              state: {
                verified: true,
                email: email,
              },
            }
          );
        } else {
          setMessage(
            "Email not found"
          );
        }
      } catch (err) {
        setLoading(false);

        setMessage(
          "Something went wrong"
        );
      }
    };

  return (
    <>
      <div className="forgot-page">

        <div className="forgot-card">

          <h2>
            Reset Your Access 🔐
          </h2>

          <p className="sub-text">
            Securely recover your account
            and continue shopping.
          </p>

          {message && (
            <div className="error-box">
              {message}
            </div>
          )}

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="premium-input"
          />

          <button
            onClick={
              handleSubmit
            }
            disabled={loading}
            className="continue-btn"
          >
            {loading
              ? "Checking..."
              : "Continue"}
          </button>

        </div>
      </div>

      <style>{`

      *{
        box-sizing:border-box;
      }

      .forgot-page{
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

      .forgot-card{
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

      .forgot-card:hover{
        transform:
        translateY(-4px);
      }

      .forgot-card h1{
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

      .premium-input{
        width:100%;
        padding:16px;
        margin-bottom:18px;

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

      .continue-btn{
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

      .continue-btn:hover{
        transform:
        translateY(-2px);

        box-shadow:
        0 10px 25px rgba(
          37,99,235,.35
        );
      }

      .continue-btn:disabled{
        opacity:.7;
        cursor:not-allowed;
      }

      @media(max-width:768px){

        .forgot-card{
          width:100%;
          padding:28px;
        }

        .forgot-card h1{
          font-size:30px;
        }

      }

      `}</style>
    </>
  );
}