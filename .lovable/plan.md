

# RREVA CARE — Herbal E-Commerce Platform

## Brand & Design
- **Brand**: RREVA CARE — Homemade Herbal Products
- **Palette**: Forest green (#2D5016), warm cream (#FDF6E3), brown accents (#8B6914), soft leaf green highlights
- **Typography**: Serif headings (Playfair Display) + clean sans-serif body (Inter)
- **Feel**: Earthy, organic, botanical — subtle leaf/plant decorative elements, rounded corners, warm shadows

## Pages & Components

### 1. Landing Page
- Hero section with tagline ("Pure. Natural. Handcrafted."), CTA button to shop, botanical background imagery (placeholder)
- Featured products carousel (3-4 items)
- "Why Herbal?" benefits section (icons + text: Chemical-free, Eco-friendly, Handmade)
- Customer testimonials section (placeholder data)
- Footer with brand info, links, social icons

### 2. Products Catalog (`/products`)
- Grid of product cards with image placeholder, name, price, "Add to Cart" button
- Filter sidebar/chips by category: Hair Care, Skin Care, Hygiene, Face Care
- Sort by price / name
- Placeholder API call for fetching products (mock data for now)

### 3. Product Detail Page (`/products/:id`)
- Large product image, name, price, description, ingredients list
- Quantity selector + "Add to Cart" button
- Related products section

### 4. Cart Section (`/cart`)
- List of cart items with quantity adjusters, remove button
- Order summary with subtotal, shipping, total
- "Proceed to Pay" button → navigates to checkout

### 5. Checkout / Payment Page (`/checkout`)
- Order summary review
- Dynamically generated QR code (using a library like `qrcode.react`) encoding a UPI payment string with the order total
- Amount displayed clearly next to QR
- "I've Completed Payment" confirmation button (placeholder API call)

### 6. Authentication (`/login`, `/signup`)
- Email + password login/signup forms
- Auth state managed via React context (placeholder — no real backend auth yet)
- Protected routes for cart/checkout

### 7. Shared Components
- Responsive navbar: logo, nav links (Home, Products, Cart icon with badge), login/profile
- Mobile hamburger menu
- Cart context/provider for state management across pages
- Footer component

## Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Hamburger nav on mobile, product grid adapts from 1 → 2 → 3 → 4 columns
- Bottom-sticky "View Cart" bar on mobile

## Data & State
- Cart stored in React context + localStorage persistence
- Mock product data with ~10 sample herbal products
- All API calls structured as async functions in a `/src/lib/api.ts` file with placeholder implementations

