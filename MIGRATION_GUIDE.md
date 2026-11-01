# Migration Guide: HTML → React Portfolio

This guide explains how to migrate your portfolio from a single HTML file to a modern React project.

## What Changed

### Before (HTML)
- Single 2700+ line HTML file
- Inline `<script>` tag with vanilla JavaScript
- Inline `<style>` tag with CSS custom properties
- No build process required
- Direct browser execution

### After (React)
- Modular component-based architecture
- React for state management and UI
- Tailwind CSS for styling
- Vite as build tool
- Production-optimized output

## Key Benefits

1. **Maintainability**: Components are isolated and reusable
2. **Scalability**: Easy to add new features and sections
3. **Performance**: Tree-shaking, code splitting, minification
4. **Developer Experience**: Hot Module Replacement (HMR) during development
5. **Best Practices**: Modern React patterns (Context API, hooks)

## Project Structure

```
portfolio/
├── src/
│   ├── components/      # UI components (Header, Hero, Pipeline, etc.)
│   ├── context/         # Global state (PortfolioContext)
│   ├── styles/          # Global CSS
│   ├── App.jsx          # Main app component
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Build configuration
├── tailwind.config.js   # Tailwind configuration
├── package.json         # Dependencies and scripts
└── README.md            # Documentation
```

## Component Breakdown

Each section of the original HTML is now a separate React component:

| Original Section | Component | File |
|---|---|---|
| Header/Nav | `Header` | `src/components/Header.jsx` |
| Hero + Terminal | `Hero` | `src/components/Hero.jsx` |
| Career Pipeline | `Pipeline` | `src/components/Pipeline.jsx` |
| Skills Matrix | `Skills` | `src/components/Skills.jsx` |
| Projects | `Projects` | `src/components/Projects.jsx` |
| Certifications | `Certifications` | `src/components/Certifications.jsx` |
| Contact Form | `Contact` | `src/components/Contact.jsx` |
| Footer | `Footer` | `src/components/Footer.jsx` |

## State Management

### Old Approach
```javascript
// In HTML <script> tag
const portfolioState = {
  name: "[YOUR FULL NAME]",
  theme: "dark",
  // ...
};
```

### New Approach (React Context)
```javascript
// src/context/PortfolioContext.jsx
const { state, updateState, toggleTheme } = usePortfolio();
```

The `PortfolioProvider` wraps the entire app and provides global state to all components via React Context.

## Styling

### Old Approach
```html
<style>
  :root {
    --bg: #070A14;
    --text: #EEF2FF;
  }
</style>
```

### New Approach
```css
/* src/styles/globals.css */
:root {
  --bg-base: var(--bg);
  --text-primary: var(--text);
}

/* Tailwind utilities */
<div className="bg-bg-base text-text-primary"></div>
```

## How to Extend

### Add a New Section

1. Create a new component in `src/components/MySectionName.jsx`:
```jsx
import React from 'react';

export const MySectionName = () => {
  return (
    <section id="my-section" className="space-y-6">
      {/* Your content */}
    </section>
  );
};
```

2. Import and add to `src/App.jsx`:
```jsx
import { MySectionName } from './components/MySectionName';

// In the JSX:
<MySectionName />
```

### Add a New Modal

Create a new component in `src/components/Modals.jsx` and use React state to control visibility:

```jsx
const [myModalOpen, setMyModalOpen] = useState(false);

<MyModal isOpen={myModalOpen} onClose={() => setMyModalOpen(false)} />
```

### Update Design Tokens

Edit `src/styles/globals.css` for the color palette and `tailwind.config.js` for spacing/typography.

## Development Workflow

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` (opens automatically)

### Build for Production
```bash
npm run build
```
Output: `dist/` folder

### Deploy
- **Docker**: Build the Dockerfile
- **AWS S3 + CloudFront**: Upload `dist/` contents
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **Vercel/Netlify**: Connect your GitHub repo

## Troubleshooting

### Q: Port 5173 is already in use
A: Change the port in `vite.config.js`:
```js
server: {
  port: 3000,
}
```

### Q: Styles aren't updating
A: Clear the browser cache or hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Q: Changes not reflecting
A: Vite HMR should auto-update. If not, restart the dev server.

### Q: Production build is larger than expected
A: Check `npm run build` output. Use `npm run preview` to test the production build locally.

## Best Practices

1. **Keep components small**: Each component should have a single responsibility
2. **Use Context for shared state**: Avoid prop drilling
3. **Add accessibility**: Use semantic HTML and ARIA labels
4. **Optimize images**: Use modern formats (WebP) and lazy loading
5. **Test before deploy**: Use `npm run preview` to test the production build

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Update your information using the customizer modal
3. ✅ Test locally: `npm run dev`
4. ✅ Build for production: `npm run build`
5. ✅ Deploy the `dist/` folder to your hosting

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [React Hooks](https://react.dev/reference/react)

---

**Original HTML file preserved as**: `your_full_name_devops_cloud_engineering_portfolio_platform.html`

You can reference it during development if needed.
