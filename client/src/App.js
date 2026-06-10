import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import AddAddress from "./pages/AddAddress";
import SavedAddresses from "./pages/SavedAddresses";
import AdminLogin from "./pages/admin/adminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";


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

  const [wishlist, setWishlist] =
    useState(() => {
      if (parsedUser) {
        const savedWishlist =
          localStorage.getItem(
            `wishlist_${parsedUser._id}`
          );

        return savedWishlist
          ? JSON.parse(savedWishlist)
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

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `wishlist_${user._id}`,
        JSON.stringify(wishlist)
      );
    }
  }, [wishlist, user]);

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
        wishlist={wishlist}
        setWishlist={setWishlist}
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
              wishlist={wishlist}
              setWishlist={setWishlist}
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
              setWishlist={setWishlist}
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

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:email"
          element={<ResetPassword />}
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

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <Wishlist
              user={user}
              wishlist={wishlist}
              setWishlist={setWishlist}
              cart={cart}
              setCart={setCart}
            />
          }
        />

{/* Address */}
        <Route
          path="/address"
          element={<AddAddress />}
        />

        <Route
          path="/address/edit/:id"
          element={<AddAddress />}
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

        <Route
  path="/saved-addresses"
  element={<SavedAddresses />}
/>

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              user={user}
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            user?.isAdmin ? (
              <Navigate
                to="/admin/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/admin/login"
                replace
              />
            )
          }
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={
            <AdminLogin
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute user={user}>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ADMIN PRODUCTS */}
        <Route
          path="/admin/products"
          element={
            <AdminRoute user={user}>
              <AdminProducts />
            </AdminRoute>
          }
        />

        {/* ADMIN ORDERS */}
        <Route
          path="/admin/orders"
          element={
            <AdminRoute user={user}>
              <AdminOrders />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
