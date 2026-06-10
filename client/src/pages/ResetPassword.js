import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

export default function ResetPassword() {

  const { email } =
    useParams();

  const navigate =
    useNavigate();

  const [password, setPassword] =
    useState("");

  const resetPassword =
    async () => {

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

      navigate("/login");
    };

  return (
    <div>
      <h2>
        Reset Password
      </h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <button
        onClick={
          resetPassword
        }
      >
        Save Password
      </button>
    </div>
  );
}