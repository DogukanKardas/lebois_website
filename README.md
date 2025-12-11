# Le Bois Technology Website

Modern, responsive, and performance-oriented enterprise software agency website.

## Features
- **Design:** Dark/Tech theme with Vanta.js topology effects.
- **Architecture:** Static HTML5/CSS3/JS (No backend required for demo).
- **Admin Panel:** Client-side content management and form handling (simulated via localStorage).
- **SEO:** Optimized for British Columbia & Alberta regions.

## Deployment on Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts (Select scope, link to existing project: no, etc.)

## Project Structure
- `index.html`: Main landing page.
- `admin.html`: Management dashboard (Pass: admin123).
- `service-*.html`: Detail pages for services.
- `style.css` & `admin.css`: Styling.
- `script.js` & `admin.js`: Logic.

## Important Note
The Admin Panel uses `localStorage` for data persistence. This means form submissions made by visitors will NOT be visible to the admin in this static deployment. For a production environment, a backend API or form service (like Formspree) is required.

# lebois_website
