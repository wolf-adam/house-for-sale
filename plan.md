# Plan — House For Sale SPA

## Goal
A static single-page website advertising a home for sale, based on the requirements in [readme.md](./readme.md).

## Sections to build

### 1. Welcome / Hero
- Full-width hero banner with a headline, short tagline, and a photo of the house.
- Call-to-action button scrolling to the gallery or the appointment form.

### 2. Home showcase (gallery)
- Grid or carousel of photos showing the exterior and interior of the home.
- Key facts strip: price, floor area, rooms, lot size, energy rating.

### 3. Room restyle slider
- A before/after comparison slider (drag handle) for one featured room.
- "Before": actual photo of the room.
- "After": AI-generated image showing how the room could look refurnished (overlapping reveal).

### 4. Nearby places
- List of closest significant places with approximate distances/times:
  - Hospital
  - Supermarket
  - Pharmacy
  - School / kindergarten
  - Public transport stop
- Optionally rendered as cards with icons.

### 5. Appointment booking
- Calendar widget for picking a viewing date (and time slot).
- Form fields: name, email, phone, preferred date/time, message.
- Submission sends an email about the requested appointment.
  - Static-site friendly options: Formspree / EmailJS / Netlify Forms, or a `mailto:` fallback.

### 6. Contact
- Contact form (name, email, message).
- Dummy phone number and email address displayed.
- Footer with basic legal/privacy note.

## Technical approach
- Plain HTML + CSS + vanilla JavaScript in a single `index.html` (plus `styles.css` / `script.js` if it grows) — no build step required.
- Mobile-first, responsive layout; smooth scroll navigation between sections.
- Placeholder images initially; swap in real photos and the AI-generated "after" image later.
- Form handling: client-side validation + chosen email service integration.

## Steps
1. Scaffold `index.html` with semantic section skeletons and navigation.
2. Add global styles (typography, colors, layout, responsiveness).
3. Build hero + gallery sections with placeholder images.
4. Implement the before/after slider component for the restyled room.
5. Add nearby-places listing.
6. Add calendar + appointment form with validation and email hookup.
7. Add contact form + footer.
8. Final pass: accessibility, performance (lazy-loaded images), and cross-device check.

## Open questions
- Real address/location for the nearby-places data, or use dummy data?
- Which email service should the forms use (Formspree, EmailJS, Netlify Forms, or `mailto:`)?
- Do you already have photos and the AI-refurnished image, or should everything use placeholders?
- Preferred color scheme / style direction?
