import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function App() {
  // LOAD FROM LOCAL STORAGE FIRST
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // SAVE USER
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} cart={cart} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login
              user={user}
              setUser={setUser}
            />
          }
        />

        <Route
          path="/register"
          element={<Register user={user} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              user={user}
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/orders"
          element={<Orders user={user} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;