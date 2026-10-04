import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";
import { CreatorProvider } from "./context/CreatorContext";

import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { CreatorHeader } from "./components/creator/CreatorHeader";
import { CreatorProtectedRoute } from "./components/creator/CreatorProtectedRoute";

// Customer Interface Pages
import { HomePage } from "./pages/HomePage";
import { ProductListingPage } from "./pages/ProductListingPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { CartPage } from "./pages/CartPage";
import { WishlistPage } from "./pages/WishlistPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { OrdersPage } from "./pages/OrdersPage";
import { AccountPage } from "./pages/AccountPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Creator / Seller Interface Pages
import { CreatorLoginPage } from "./pages/creator/CreatorLoginPage";
import { CreatorDashboardPage } from "./pages/creator/CreatorDashboardPage";
import { CreatorProductsPage } from "./pages/creator/CreatorProductsPage";
import { CreatorOrdersPage } from "./pages/creator/CreatorOrdersPage";
import { CreatorEarningsPage } from "./pages/creator/CreatorEarningsPage";
import { CreatorProfilePage } from "./pages/creator/CreatorProfilePage";
import { CreatorRegisterPage } from "./pages/creator/CreatorRegisterPage";
import { CreatorPublicStorePage } from "./pages/creator/CreatorPublicStorePage";
import { HostDashboardPage } from "./pages/HostDashboardPage";

function AppLayout() {
  const location = useLocation();
  const isCreatorLogin = location.pathname === "/creator/login" || location.pathname === "/seller/login";
  const isCreatorPortal = location.pathname.startsWith("/creator") && location.pathname !== "/creator-store" && !isCreatorLogin;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 
        Clean separation:
        - Customer side has standard customer Header
        - Creator Studio has Seller Studio Header (only when logged in)
        - Creator Login has its own dedicated clean layout
      */}
      {isCreatorPortal ? (
        <CreatorHeader />
      ) : isCreatorLogin ? null : (
        <Header />
      )}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* ========================================================= */}
          {/* 1. CUSTOMER SHOPPING INTERFACE (Shopper / Buyer View)     */}
          {/*    Pure shopping content without any admin clutter        */}
          {/* ========================================================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/creator-store" element={<CreatorPublicStorePage />} />
          <Route path="/store/:creatorId" element={<CreatorPublicStorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ========================================================= */}
          {/* 2. CREATOR / SELLER INTERFACE (Protected by Login)        */}
          {/*    Requires username and password authentication          */}
          {/* ========================================================= */}
          <Route path="/creator/login" element={<CreatorLoginPage />} />
          <Route path="/seller/login" element={<CreatorLoginPage />} />
          
          <Route
            path="/creator"
            element={
              <CreatorProtectedRoute>
                <CreatorDashboardPage />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/products"
            element={
              <CreatorProtectedRoute>
                <CreatorProductsPage />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/orders"
            element={
              <CreatorProtectedRoute>
                <CreatorOrdersPage />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/earnings"
            element={
              <CreatorProtectedRoute>
                <CreatorEarningsPage />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/profile"
            element={
              <CreatorProtectedRoute>
                <CreatorProfilePage />
              </CreatorProtectedRoute>
            }
          />
          <Route path="/creator/register" element={<CreatorRegisterPage />} />
          
          {/* Aliases for /seller */}
          <Route
            path="/seller"
            element={
              <CreatorProtectedRoute>
                <CreatorDashboardPage />
              </CreatorProtectedRoute>
            }
          />
          <Route path="/seller/register" element={<CreatorRegisterPage />} />

          {/* Admin routes protected */}
          <Route
            path="/host"
            element={
              <CreatorProtectedRoute>
                <HostDashboardPage />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <CreatorProtectedRoute>
                <HostDashboardPage />
              </CreatorProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Customer Footer displayed only on customer shopping pages */}
      {!isCreatorPortal && !isCreatorLogin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CreatorProvider>
            <ProductProvider>
              <CartProvider>
                <WishlistProvider>
                  <OrderProvider>
                    <AppLayout />
                  </OrderProvider>
                </WishlistProvider>
              </CartProvider>
            </ProductProvider>
          </CreatorProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
