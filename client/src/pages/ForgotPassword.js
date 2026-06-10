import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const navigate =
    useNavigate();

  const handleSubmit =
    async () => {

        console.log("Button clicked");
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

      if (data.success) {
        navigate(
          `/reset-password/${email}`
        );
      } else {
        setMessage(
          "Email not found"
        );
      }
    };

  return (
    <div>
      <h2>
        Forgot Password
      </h2>

      <input
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <button
        onClick={
          handleSubmit
        }
      >
        Continue
      </button>

      <p>{message}</p>
    </div>
  );
}