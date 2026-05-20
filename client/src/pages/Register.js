import { useState } from "react";

export default function Register({ user }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Block access if already logged in
  if (user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>You are already logged in</h2>
        <p>Please logout before creating another account.</p>
      </div>
    );
  }

  const handleRegister = async () => {
    await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ari",
        email,
        password,
      }),
    });

    alert("Registered successfully");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}