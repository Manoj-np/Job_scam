import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');
  const routes = ['demo', 'analyze', 'scan-pdf', 'history', 'campaigns', 'login', 'register'];

  routes.forEach((route) => {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml);
  });

  // Also create 200.html and 404.html fallback
  fs.writeFileSync(path.join(distDir, '200.html'), indexHtml);
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml);
  console.log('✓ Successfully generated SPA route fallback pages for Render.');
} else {
  console.warn('index.html not found in dist, skipping postbuild route generation.');
}
