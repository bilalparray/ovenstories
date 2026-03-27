Phase 1 MVP Plan (4–7 Days)
Step 1: Project Setup & Cleanup (Day 1)
Freeze scope: pages, categories, WhatsApp number, delivery rules.
Keep only required pages from template (index, menu, contact, about, gallery).

Step 1 Implementation Notes (Locked for MVP)
Frozen scope date: 2026-03-27
Project: Oven Stories MVP (WhatsApp ordering)

MVP pages (only)
- index.html (Home)
- menu.html (Menu + add to cart)
- contact.html (Contact + map + CTA)
- about.html (About + story)
- gallery.html (Gallery)

Template page mapping
- index.html -> index.html
- menu.html -> menu.html
- contact.html -> contact.html
- about.html -> about.html
- gallery.html -> gallery.html

Out of MVP scope (Phase 1)
- menu-list-2.html
- menu-list-3.html
- reservation-v1.html
- blog-list.html
- blog-detail.html
- our-chef.html
- reviews.html

Frozen business config (for Phase 1)
- WhatsApp number: +91 9796662338
- Contact phone: +91 9796662338
- Email: care@ovenstories.in
- Address: Mustafa Abad, HMT-190012, Srinagar, Jammu and Kashmir
- Timings: Monday-Sunday, 10:00 AM - 10:00 PM
- Free delivery rule: up to 5 km for orders above 499

Frozen menu categories (Phase 1)
- Pizza
- Burger
- Calzone
- Wraps
- Shawarma
- Chips
- Drinks
- Chicken Fried Rice

Remove unused plugins/scripts to improve speed.
Create clean folder structure:
assets/ (images, icons)
data/menu.json
js/app.js, js/cart.js, js/whatsapp.js
Set global config file for business info (phone, address, timings, free-delivery text).
Step 2: Rebrand Template to Oven Stories (Day 1–2)
Replace logo, colors, typography, hero copy, CTA text.
Update all sections with real Oven Stories content:
Best sellers
Delivery policy (e.g., free delivery terms)
Contact details and timings
Replace placeholder images with client-approved assets.
Ensure nav and footer are consistent on all pages.
Step 3: Menu Data Model (Day 2)
Build menu.json structure with:
id, name, category, price, image, description, isAvailable, isVeg
Categories to include:
Pizza, Burger, Calzone, Wraps, Shawarma, Chips, Drinks, Chicken Fried Rice
Add optional fields for variants (small/medium/large) and add-ons.
Validate data format and pricing consistency.
Step 4: Dynamic Menu Rendering (Day 2–3)
Build menu page from menu.json (no hardcoded item cards).
Add category tabs/filters + search.
Show item availability badges (Available/Out of stock).
Add “Add to Cart” button on each card.
Add loading/fallback UI if JSON fails.
Step 5: Cart System (Day 3–4)
Create cart drawer/page with:
Add/remove items
Quantity controls
Line totals + subtotal
Persist cart using localStorage.
Add basic cart rules:
Prevent quantity below 1
Handle unavailable items
Show cart count in header on all pages.
Step 6: WhatsApp Checkout (Day 4)
Checkout form fields:
Name, phone, address, landmark, order type (delivery/pickup), notes
Build WhatsApp message from cart + customer data.
Generate encoded wa.me URL and open on button click.
Add pre-submit checks:
Required fields
Valid phone format
Non-empty cart
Add “Order sent” instruction screen (user guidance after redirect).
Step 7: Mobile Optimization (Day 5)
Test breakpoints: 320, 375, 425, 768, 1024.
Improve tap targets, spacing, sticky cart CTA for mobile.
Optimize image sizes and lazy-load where possible.
Ensure menu filtering and cart are smooth on low-end devices.
Step 8: Basic SEO & Local Business Setup (Day 5–6)
Add unique title/meta description per page.
Add Open Graph tags (share preview).
Add LocalBusiness schema (JSON-LD) with address, phone, hours.
Add favicon, sitemap, and robots file.
Optimize headings (h1/h2) and internal links.
Step 9: QA + UAT + Deploy (Day 6–7)
Full test checklist:
Menu load
Cart math
WhatsApp message accuracy
Mobile responsiveness
Form validation
Cross-browser sanity: Chrome, Edge, mobile browsers.
Deploy to Netlify/Vercel/shared hosting.
Final handover:
Editable menu JSON
Simple update guide for client
Deliverables at End of Phase 1
Branded Oven Stories website
Dynamic menu from JSON
Working cart
WhatsApp-based checkout flow
Mobile-optimized pages
Basic SEO setup
Live deployed URL
