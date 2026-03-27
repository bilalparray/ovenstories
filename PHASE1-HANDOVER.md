# Oven Stories Phase 1 Handover

This project is now set up as a static MVP with a WhatsApp-based ordering flow.

## What Is Implemented

- MVP page structure and navigation standardized to:
  - `index.html`
  - `menu.html` (routes to `menu.html`)
  - `about.html` (routes to `about.html`)
  - `contact.html` (routes to `contact.html`)
  - `gallery.html`
- Dynamic menu rendering from `data/menu.json`
- Cart system with `localStorage` persistence
- Checkout form with validation (delivery/pickup support)
- WhatsApp order message generation and send flow
- Basic SEO metadata + Open Graph + LocalBusiness schema
- `sitemap.xml` and `robots.txt` added

## Files You Will Edit Most

- Business details: `js/config.js`
- Menu items and prices: `data/menu.json`

## How To Update Business Details

Edit `js/config.js`:

- `brandName`
- `whatsappNumber` (must be country code + number, no `+`, e.g. `919796662338`)
- `phoneDisplay`
- `phoneHref`
- `email`
- `address`
- `hours`
- `freeDeliveryRule`
- `currencySymbol`

## How To Add Or Edit Menu Items

Edit `data/menu.json` under the correct category:

- Required item fields:
  - `id` (unique, no spaces, e.g. `pizza-margherita`)
  - `name`
  - `category`
  - `price` (number only)
  - `image` (path)
  - `description`
  - `isAvailable` (`true`/`false`)
  - `isVeg` (`true`/`false`)

Example item:

```json
{
  "id": "burger-zinger",
  "name": "Zinger Burger",
  "category": "Burger",
  "price": 229,
  "image": "assets/images/menu/burger-zinger.jpg",
  "description": "Crispy zinger patty, lettuce, house sauce.",
  "isAvailable": true,
  "isVeg": false
}
```

## WhatsApp Order Flow (Current)

1. User adds items from menu.
2. User reviews cart and fills checkout details.
3. App generates a formatted WhatsApp message.
4. WhatsApp opens via `wa.me` link.
5. User presses Send in WhatsApp to finalize.

## QA Checklist (Phase 1)

- [x] Menu loads from `data/menu.json`
- [x] Category filters work
- [x] Search works
- [x] Add to cart works
- [x] Quantity increment/decrement/remove works
- [x] Subtotal and total update correctly
- [x] Delivery charge logic applied (`0` for pickup, free delivery threshold support)
- [x] Validation for required fields and phone format
- [x] WhatsApp URL generation wired
- [x] SEO tags + schema + sitemap + robots present

## Manual Post-Deploy Checks (Required)

- [ ] Verify all images load on hosting environment
- [ ] Verify WhatsApp opens correctly on Android/iOS/desktop
- [ ] Verify contact links (`tel:`, `mailto:`) on mobile
- [ ] Validate `sitemap.xml` and `robots.txt` on live domain
- [ ] Test full order flow with real menu and final pricing

## Known MVP Constraints

- No backend order dashboard (orders are sent through WhatsApp only)
- No online payment gateway in Phase 1
- No stock management sync with backend
- Menu is file-based JSON editing (not admin panel)
