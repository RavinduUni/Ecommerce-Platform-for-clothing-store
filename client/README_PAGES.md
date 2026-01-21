# Ecommerce Platform - Client

This is the frontend client for the Fashion Store ecommerce platform built with React, Vite, TailwindCSS, and React Router DOM.

## Installation

First, install the required dependencies:

```bash
npm install
npm install react-router-dom
```

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx     # Main navigation component
│   │   └── Footer.jsx     # Footer component
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx   # Home/Landing page
│   │   ├── ProductListingPage.jsx  # Product catalog
│   │   ├── ProductDetailsPage.jsx  # Single product view
│   │   ├── ShoppingCartPage.jsx    # Shopping cart
│   │   ├── CheckoutPage.jsx        # Checkout process
│   │   └── InventoryManagementPage.jsx # Admin inventory
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/
├── index.html
└── package.json
```

## Available Routes

### Customer Routes
- `/` - Home page with featured categories and best sellers
- `/products` - Product listing page with filters
- `/product/:id` - Individual product details page
- `/cart` - Shopping cart
- `/checkout` - Secure checkout process

### Admin Routes
- `/admin/inventory` - Inventory management dashboard

## Design System

### Colors
- **Primary**: `#d4a411` (Gold)
- **Background Light**: `#f8f8f6`
- **Background Dark**: `#221d10`

### Typography
- **Display Font**: Inter
- **Serif Font**: Playfair Display

### Components
All components maintain the exact styling from the original HTML files:
- Material Design icons via Google Material Symbols
- Tailwind CSS for styling
- Responsive design (mobile-first)
- Dark mode support

## Development

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Features

✅ Fully responsive design
✅ Dark mode support
✅ React Router DOM navigation
✅ Reusable Navbar and Footer components
✅ Product hover effects
✅ Shopping cart functionality
✅ Secure checkout flow
✅ Admin inventory management
✅ Exact HTML styling preserved

## Notes

- All images and styling are preserved from the original HTML files
- React Router DOM is used for client-side routing
- The Navbar and Footer are reusable components used across customer-facing pages
- Admin routes don't include Navbar/Footer for cleaner dashboard experience
- Material Symbols icons are loaded from Google Fonts CDN
