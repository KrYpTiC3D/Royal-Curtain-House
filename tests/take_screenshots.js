const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

const rootDir = 'C:\\Arhab\\Work\\Royal Curtain House';
const artifactDir = 'C:\\Users\\arhab\\.gemini\\antigravity\\brain\\7e71473f-c361-4c6f-bd12-83ba3e389d0d';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function createServer(port) {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(rootDir, reqPath);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

async function capture() {
  const server = createServer(8123);
  await new Promise(resolve => server.listen(8123, resolve));
  console.log('Temporary server running on 8123');

  const browser = await chromium.launch();

  // Desktop context
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  // 1. Desktop Home Light
  const p1 = await desktop.newPage();
  await p1.goto('http://localhost:8123/index.html');
  await p1.waitForTimeout(1000);
  await p1.screenshot({ path: path.join(artifactDir, 'matale-home-desktop-light.png'), fullPage: false });

  // 2. Desktop Home Dark
  await p1.click('#themeToggle');
  await p1.waitForTimeout(600);
  await p1.screenshot({ path: path.join(artifactDir, 'matale-home-desktop-dark.png'), fullPage: false });

  // 3. Desktop Collections
  const p2 = await desktop.newPage();
  await p2.goto('http://localhost:8123/collections.html');
  await p2.waitForTimeout(1000);
  await p2.screenshot({ path: path.join(artifactDir, 'matale-collections-desktop.png'), fullPage: false });

  // 4. Desktop Services
  const p3 = await desktop.newPage();
  await p3.goto('http://localhost:8123/services.html');
  await p3.waitForTimeout(1000);
  await p3.screenshot({ path: path.join(artifactDir, 'matale-services-desktop.png'), fullPage: false });

  // 5. Desktop Contact
  const p4 = await desktop.newPage();
  await p4.goto('http://localhost:8123/contact.html');
  await p4.waitForTimeout(1000);
  await p4.screenshot({ path: path.join(artifactDir, 'matale-contact-desktop.png'), fullPage: false });

  // 6. Mobile 390px (iPhone / Pixel format)
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const pm = await mobile.newPage();
  await pm.goto('http://localhost:8123/index.html');
  await pm.waitForTimeout(1000);
  await pm.screenshot({ path: path.join(artifactDir, 'matale-home-mobile-390px.png'), fullPage: false });

  // 7. Mobile Drawer Open
  await pm.click('#navToggle');
  await pm.waitForTimeout(500);
  await pm.screenshot({ path: path.join(artifactDir, 'matale-mobile-drawer-open.png'), fullPage: false });

  await browser.close();
  server.close();
  console.log('Screenshots successfully captured to artifacts!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});

