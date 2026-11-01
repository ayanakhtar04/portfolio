# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```
This installs React, Tailwind CSS, Vite, and other required packages.

### Step 2: Start Development Server
```bash
npm run dev
```
Your portfolio opens automatically at `http://localhost:5173`

### Step 3: Customize Your Portfolio
1. Click **"Edit Identity & Placeholders"** button
2. Enter your:
   - Full name
   - Email address
   - GitHub profile URL
   - LinkedIn profile URL
   - Resume PDF path
3. Changes are saved automatically and apply site-wide

## 📁 Important Files

- **`src/App.jsx`** - Main app component
- **`src/styles/globals.css`** - Design tokens and global styles
- **`src/components/`** - All section components
- **`tailwind.config.js`** - Tailwind configuration
- **`vite.config.js`** - Vite build settings
- **`index.html`** - HTML template

## 🎨 Customization

### Change Colors
Edit CSS variables in `src/styles/globals.css`:
```css
:root {
  --cyan: #22D3EE;        /* Change this */
  --lime: #BEF264;        /* And this */
}
```

### Add New Content
1. Create a new component in `src/components/MyComponent.jsx`
2. Import it in `src/App.jsx`
3. Add it to the JSX

### Update Resume
Add your resume PDF to `public/resume.pdf`, then update the path in the customizer modal.

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```
Output folder: `dist/`

### Test Production Build
```bash
npm run preview
```

### Deploy Options

**Docker:**
```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

**AWS S3 + CloudFront:**
1. Build: `npm run build`
2. Upload `dist/` to S3 bucket
3. Create CloudFront distribution

**GitHub Pages:**
1. Build: `npm run build`
2. Push `dist/` to `gh-pages` branch

**Vercel/Netlify:**
1. Push repo to GitHub
2. Connect to Vercel/Netlify
3. Automatic deploys on push

## 🔧 Development

### Available Scripts
- `npm run dev` - Start dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Useful Keyboard Shortcuts
- `Ctrl/Cmd + K` - Vite dev menu
- `Ctrl/Cmd + Shift + R` - Hard refresh (clear cache)
- `Ctrl/Cmd + J` - Open browser DevTools

## 📚 Learn More

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed changes
- See [README.md](README.md) for full documentation

## 🆘 Troubleshooting

**Port 5173 in use:**
```bash
# Use a different port
npm run dev -- --port 3000
```

**Styles not updating:**
- Hard refresh the browser (Ctrl/Cmd + Shift + R)
- Restart the dev server

**Node version issues:**
- This project requires Node 16+
- Check with: `node --version`

## ✅ Next Steps

1. [ ] Run `npm install`
2. [ ] Run `npm run dev`
3. [ ] Click "Edit Identity & Placeholders"
4. [ ] Update your information
5. [ ] Customize colors and styles
6. [ ] Add your resume to `public/resume.pdf`
7. [ ] Test the build: `npm run build`
8. [ ] Deploy to your hosting platform

---

**Questions?** See the [full README](README.md) or [Migration Guide](MIGRATION_GUIDE.md).
