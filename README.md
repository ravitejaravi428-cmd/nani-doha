# NANI DOHA - Modern Luxury & Everyday E-Commerce Platform

**NANI DOHA** is a modern, responsive, high-performance e-commerce shopping website built with **React.js**, **Vite**, **JavaScript**, **HTML5**, **CSS3 (Vanilla Modern Design System)**, and **React Router**.

---

## 🌟 Key Features & Architecture

### 1. Header & Navigation
- **Sticky Header** with glassmorphism blur and subtle shadow.
- **Brand Identity**: Monogram logo with gradient badge.
- **Search System**: Live auto-suggest search bar showing product thumbnails, categories, and prices as you type.
- **Live Badges**: Dynamic cart item count and wishlist badge in real-time.
- **User Account**: Quick profile dropdown with instant access to Orders, Wishlist, Profile, and Sign Out.
- **Responsive Mobile Navigation**: Slide-out drawer with search, department pills, and navigation links.

### 2. Homepage Experience
- **Hero Section**: Curated luxury showcase banner with CTAs ("Shop Now" & "Explore Deals") and floating trust badges.
- **Trust Badges Bar**: 4 key value propositions (Free Express Delivery over $100, 30-Day Easy Returns, 100% Genuine Certified, 24/7 Support).
- **Interactive Categories**: Department tiles (Electronics, Fashion, Shoes, Home & Kitchen, Accessories, Beauty).
- **Flash Deals**: Real-time ticking countdown timer with limited-stock discount badges.
- **Featured Products**: Category tab selector (Electronics, Fashion, Footwear, Home, Accessories).
- **Curated Promo Banners**: Spatial Audio and Contemporary Wardrobe highlights.
- **Best Sellers**: Top-ranked luxury products showcase.
- **Customer Reviews**: Testimonial cards with star ratings and verified buyer badges.
- **VIP Newsletter**: Subscription box with animated success state and toast notification.
- **Footer**: Brand story, quick links, contact info, customer service, social links, and accepted payment methods.

### 3. Product Listing Page (`/products`)
- **Multi-Faceted Working Filters**:
  - Filter by Category / Department (Electronics, Fashion, Shoes, Home & Kitchen, Accessories, Beauty)
  - Filter by Brand (Apple, Sony, Samsung, Nike, Adidas, Levi's, Dyson, Ray-Ban, etc.)
  - Price Range Slider / Inputs (Min and Max)
  - Customer Rating filter (4.8★+, 4.5★+, 4.0★+)
  - Discount filter (10%+, 20%+, 30%+)
  - Flash Deals toggle & In-Stock only toggle
- **Sorting**: Most Popular, Highest Rated, Price: Low to High, Price: High to Low, Newest Arrivals.
- **Active Filter Chips**: Instant badge dismissals and "Clear All" reset button.
- **Display Modes**: Grid view and List view toggle.
- **Load More / Pagination**: Smooth batch loading.

### 4. Product Details Page (`/product/:id`)
- **High-Res Gallery**: Main preview with interactive thumbnails that change the image on click.
- **Variant Swatches**: Clickable color palette swatches and size buttons.
- **Quantity Stepper**: Custom stepper (`-` / `+`) bounded by stock.
- **Actions**: "Add to Cart", "Buy Now" (instant checkout redirection), and animated Wishlist heart toggle.
- **Specifications & Policy Tabs**: Technical specifications table, customer reviews breakdown, and Qatar / Global shipping policies.
- **Review Submission**: Working customer review form with star selection and instant display.
- **Related Products Grid**: Same-category product recommendations.

### 5. Shopping Cart (`/cart`)
- Itemized list with thumbnail, selected color/size, unit price, quantity controls, and total.
- **Save For Later**: Move items between active cart and saved items list.
- **Free Shipping Progress Meter**: Dynamic meter tracking progress toward free express delivery.
- **Coupon System**: Working promo codes (`DOHA20` for 20% off, `NANI10` for 10% off, `FREESHIP` for free shipping).
- **Financial Breakdown**: Items Subtotal, Catalog Savings, Promo Discount, Estimated Shipping, 5% VAT Tax, and Final Total.
- **Persistence**: Retains all items in `localStorage` across page refreshes.

### 6. Wishlist (`/wishlist`)
- Save favorites with 1-click add/remove.
- Move directly to cart from wishlist.
- LocalStorage persistence.

### 7. Multi-Step Checkout (`/checkout`)
- **Step 1: Delivery Address**: Pick from saved addresses or create a new address.
- **Step 2: Payment Method**: Choose between Credit/Debit Card (with card details form), Instant UPI (with VPA input), or Cash on Delivery.
- **Step 3: Review & Place Order**: Full item review and final confirmation button.

### 8. Order Confirmation & Tracking (`/order-confirmation/:orderId` & `/orders`)
- **Celebration Confetti**: Visual reward on successful checkout.
- **Order Details**: Order ID, estimated delivery date, shipping address, payment method, and itemized invoice.
- **Order History (`/orders`)**: Filter by status (All, Out for Delivery, Confirmed, Delivered).
- **Interactive Tracking Modal**: Step-by-step progress timeline (Order Placed -> Confirmed -> Shipped -> Out for Delivery -> Delivered).

### 9. User Profile & Simulated Auth (`/account`, `/login`, `/register`)
- Simulated user authentication with local storage.
- Pre-configured demo user with **⚡ One-Click Instant Demo Login**.
- Address book management (add, delete, set default).
- Profile details editing (name, email, phone).

---

## 🚀 How to Run the Project

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The application will start on:
👉 **`http://localhost:5173/`** (or `http://127.0.0.1:5173/`)

### 3. Build for Production
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```

---

## 🎨 Sample Coupon Codes
- **`DOHA20`** : 20% off entire order
- **`NANI10`** : 10% off entire order
- **`FREESHIP`** : Free express shipping
