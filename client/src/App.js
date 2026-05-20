import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home user={user} cart={cart} setCart={setCart} />} />
        <Route path="/login" element={<Login user={user} setUser={setUser} />} />
        <Route path="/register" element={<Register user={user} />} />
        <Route path="/cart" element={<Cart user={user} cart={cart} setCart={setCart} />} />
        <Route path="/orders" element={<Orders user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;