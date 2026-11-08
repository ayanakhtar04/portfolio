# DevOps Portfolio Platform

A modern, interactive DevOps and Cloud Engineering portfolio built with React, Tailwind CSS, and Vite.

## Features

- **React-based**: Component-driven architecture for maintainability and scalability
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Dark/Light Themes**: Theme switcher with localStorage persistence
- **Interactive Terminal**: Simulated CLI for a tech-forward presentation
- **State Management**: Context API for managing portfolio state
- **Custom Design System**: Consistent color palette and spacing tokens

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Navigation and theme controls
│   ├── Hero.jsx        # Hero section with terminal
│   ├── Pipeline.jsx    # Career pipeline stages
│   ├── Skills.jsx      # Skills matrix view
│   ├── Projects.jsx    # Project cards
│   ├── Certifications.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   └── Modals.jsx      # Customizer and Resume modals
├── context/            # React Context
│   └── PortfolioContext.jsx
├── styles/             # Global styles
│   └── globals.css
├── App.jsx             # Main app component
└── main.jsx            # React entry point

public/                # Static assets
index.html             # HTML template
tailwind.config.js     # Tailwind configuration
vite.config.js         # Vite configuration
postcss.config.js      # PostCSS configuration
```

## Setup & Installation

### Prerequisites
- Node.js 16+ (recommended 18+)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```
   Output goes to the `dist/` folder

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Customization

### Update Your Information

Click **"Edit Identity & Placeholders"** in the portfolio to fill in:
- Full name
- Email
- GitHub URL
- LinkedIn URL
- Resume PDF path

All changes are saved to localStorage and apply site-wide.

### Design Tokens

Modify colors, spacing, and typography in:
- **`src/styles/globals.css`** - CSS custom properties
- **`tailwind.config.js`** - Tailwind theme extensions

### Add New Sections

1. Create a new component in `src/components/`
2. Import and add to `src/App.jsx`
3. Follow the existing component patterns for consistency

## Features Breakdown

### Header Navigation
- Sticky navigation with section links
- Theme toggle (Dark/Light)
- Accent color switcher (Cyan/Green)
- Mobile-responsive menu

### Hero Section
- Recruiter-focused pitch
- Interactive terminal CLI emulator
- System status observability strip
- Call-to-action buttons

### Pipeline Section
- Career journey visualization
- Stage-by-stage breakdown
- Learn → Build → Test → Deploy → Monitor

### Skills Section
- Terraform IaC code view
- Clean grid view option
- Filter by proficiency level
- Inspector for detailed capabilities

### Projects Section
- Project cards with tags
- Status indicators
- Case study buttons

### Certifications Section
- Achieved certifications
- In-progress learning
- Planned certifications

### Contact Section
- Direct email/GitHub/LinkedIn endpoints
- Contact form with JSON payload preview
- Availability status

## Technologies

- **React 18.3.1** - UI framework
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **Vite 5.0.8** - Build tool & dev server
- **PostCSS** - CSS processing
- **JavaScript ES6+** - Modern JavaScript

## Deployment

### Docker

Build and run with Docker:
```bash
docker build -t devops-portfolio .
docker run -p 3000:3000 devops-portfolio
```

### AWS S3 + CloudFront

```bash
npm run build
# Upload dist/ contents to S3
# Create CloudFront distribution with OAC
```

### GitHub Pages

```bash
npm run build
# Push dist/ to gh-pages branch
```

## Development Notes

- **State Management**: Uses React Context API for global state
- **Styling**: CSS custom properties + Tailwind utilities
- **Dark Mode**: Automatically applies `dark` class to `html` element
- **Responsive**: Mobile-first with sm, md, lg breakpoints
- **Accessibility**: Semantic HTML, ARIA labels, focus management

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## License

Personal use. Customize and deploy for your own portfolio.

## Contact

See the contact section in the portfolio for direct communication channels.
