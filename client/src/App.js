import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";

// LOAD SAVED USER
const savedUser = localStorage.getItem("user");

const parsedUser = savedUser
  ? JSON.parse(savedUser)
  : null;

function App() {
  // USER STATE
  const [user, setUser] =
    useState(parsedUser);

  // CART STATE
  const [cart, setCart] =
    useState(() => {
      if (parsedUser) {
        const savedCart =
          localStorage.getItem(
            `cart_${parsedUser._id}`
          );

        return savedCart
          ? JSON.parse(savedCart)
          : [];
      }

      return [];
    });

  // ORDERS STATE
  const [orders, setOrders] =
    useState([]);

  // SAVE USER
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    }
  }, [user]);

  // SAVE USER CART
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `cart_${user._id}`,
        JSON.stringify(cart)
      );
    }
  }, [cart, user]);

  // FETCH USER ORDERS
  useEffect(() => {
    if (!user) return;

    fetch(
      "http://localhost:5000/api/orders"
    )
      .then((res) => res.json())
      .then((data) => {
        const userOrders =
          data.filter(
            (order) =>
              order.userId ===
              user._id
          );

        setOrders(userOrders);
      });
  }, [user]);

  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <Navbar
        user={user}
        setUser={setUser}
        cart={cart}
        setCart={setCart}
      />

      <Routes>
        {/* HOME */}
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

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              user={user}
              setUser={setUser}
              setCart={setCart}
            />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <Register
              user={user}
            />
          }
        />

        {/* CART */}
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

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <Orders user={user} />
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              cart={cart}
              orders={orders}
            />
          }
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              user={user}
              cart={cart}
              setCart={setCart}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;