import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ user, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Block access if already logged in
  if (user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>You are already logged in</h2>
        <p>Please logout to login with another account.</p>
      </div>
    );
  }

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.user) {
      setUser(data.user);

localStorage.setItem(
  "user",
  JSON.stringify(data.user)
);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}