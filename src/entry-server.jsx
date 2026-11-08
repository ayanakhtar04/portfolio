// Build-time render of the page to HTML (scripts/prerender.mjs), so crawlers
// and link-preview bots that don't run JavaScript still get the full content.
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { PortfolioProvider } from './context/PortfolioContext';

export const render = () => renderToString(
  <PortfolioProvider>
    <App />
  </PortfolioProvider>,
);
