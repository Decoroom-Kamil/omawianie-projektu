import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const screenshotsDir = path.resolve('public/screenshots');
const wellKnownDir = path.resolve('public/.well-known');

[publicDir, screenshotsDir, wellKnownDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// SVG standard icon
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="104" fill="url(#bgGrad)"/>
  <rect x="8" y="8" width="496" height="496" rx="96" fill="none" stroke="#334155" stroke-width="6" opacity="0.6"/>

  <g filter="url(#shadow)">
    <rect x="116" y="100" width="280" height="340" rx="28" fill="#1e293b" stroke="#f59e0b" stroke-width="8"/>
    <rect x="196" y="70" width="120" height="48" rx="14" fill="url(#goldGrad)"/>
    <circle cx="256" cy="94" r="10" fill="#0f172a"/>
    <line x1="166" y1="180" x2="260" y2="180" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
    <line x1="166" y1="230" x2="310" y2="230" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
    <line x1="166" y1="280" x2="240" y2="280" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
    <circle cx="330" cy="330" r="56" fill="#10b981"/>
    <path d="M308 330 L324 346 L356 312" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

// Maskable SVG with safe margin (15% padding)
const svgMaskable = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>

  <rect width="512" height="512" fill="url(#bgGrad)"/>

  <g transform="translate(51, 51) scale(0.8)">
    <rect x="116" y="100" width="280" height="340" rx="28" fill="#1e293b" stroke="#f59e0b" stroke-width="10"/>
    <rect x="196" y="70" width="120" height="48" rx="14" fill="url(#goldGrad)"/>
    <circle cx="256" cy="94" r="10" fill="#0f172a"/>
    <line x1="166" y1="180" x2="260" y2="180" stroke="#94a3b8" stroke-width="14" stroke-linecap="round"/>
    <line x1="166" y1="230" x2="310" y2="230" stroke="#94a3b8" stroke-width="14" stroke-linecap="round"/>
    <line x1="166" y1="280" x2="240" y2="280" stroke="#94a3b8" stroke-width="14" stroke-linecap="round"/>
    <circle cx="330" cy="330" r="56" fill="#10b981"/>
    <path d="M308 330 L324 346 L356 312" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

// Desktop Screenshot SVG (1280x720)
const svgDesktopScreenshot = `
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <!-- Window Background -->
  <rect width="1280" height="720" fill="#090d16"/>

  <!-- Top App Navigation Bar -->
  <rect width="1280" height="64" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <rect x="32" y="14" width="36" height="36" rx="8" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-opacity="0.4"/>
  <text x="80" y="38" fill="#f8fafc" font-size="16" font-weight="bold">Protokół Omawiania Projektu</text>
  <rect x="320" y="24" width="86" height="20" rx="4" fill="#f59e0b" fill-opacity="0.2"/>
  <text x="328" y="38" fill="#fbbf24" font-size="11" font-weight="600">PWA &amp; APK</text>
  <text x="80" y="52" fill="#94a3b8" font-size="11">Projekt Apartament Marina • Architekt Anna Nowak • Koordynator Piotr Wiśniewski</text>

  <!-- Metric Badges in Top Bar -->
  <rect x="840" y="16" width="200" height="32" rx="16" fill="#1e293b" stroke="#334155"/>
  <circle cx="860" cy="32" r="6" fill="#10b981"/>
  <text x="872" y="36" fill="#10b981" font-size="12" font-weight="bold">36 TAK</text>
  <text x="922" y="36" fill="#64748b" font-size="12">|</text>
  <circle cx="940" cy="32" r="6" fill="#f43f5e"/>
  <text x="952" y="36" fill="#f43f5e" font-size="12" font-weight="bold">1 NIE</text>
  <text x="990" y="36" fill="#64748b" font-size="12">|</text>
  <text x="1002" y="36" fill="#38bdf8" font-size="12" font-weight="bold">2/2 ✍️</text>

  <!-- Export Button in Top Bar -->
  <rect x="1060" y="14" width="188" height="36" rx="8" fill="#f59e0b"/>
  <text x="1084" y="38" fill="#0f172a" font-size="13" font-weight="bold">📄 Generuj PDF &amp; Udostępnij</text>

  <!-- Categories Filter Bar -->
  <rect x="180" y="84" width="920" height="42" rx="10" fill="#0f172a" stroke="#1e293b"/>
  <rect x="186" y="89" width="120" height="32" rx="8" fill="#f59e0b"/>
  <text x="202" y="110" fill="#0f172a" font-size="12" font-weight="bold">Wszystkie (39)</text>

  <rect x="314" y="89" width="140" height="32" rx="8" fill="#1e293b"/>
  <text x="328" y="110" fill="#cbd5e1" font-size="12" font-weight="500">Zmiany budowlane</text>

  <rect x="462" y="89" width="150" height="32" rx="8" fill="#1e293b"/>
  <text x="474" y="110" fill="#cbd5e1" font-size="12" font-weight="500">Instalacja elektryczna</text>

  <rect x="620" y="89" width="130" height="32" rx="8" fill="#1e293b"/>
  <text x="642" y="110" fill="#cbd5e1" font-size="12" font-weight="500">Zmiany wod-kan</text>

  <rect x="758" y="89" width="80" height="32" rx="8" fill="#1e293b"/>
  <text x="778" y="110" fill="#cbd5e1" font-size="12" font-weight="500">Parapet</text>

  <!-- Card 1 -->
  <rect x="180" y="146" width="920" height="100" rx="12" fill="#0f172a" stroke="#1e293b"/>
  <rect x="180" y="146" width="4" height="100" rx="2" fill="#10b981"/>
  <text x="204" y="174" fill="#f8fafc" font-size="15" font-weight="bold">1. Czy projekt był przesłany do sprawdzenia:</text>
  <rect x="204" y="188" width="60" height="24" rx="4" fill="#10b981" fill-opacity="0.2"/>
  <text x="220" y="204" fill="#34d399" font-size="11" font-weight="bold">TAK</text>
  <text x="280" y="204" fill="#94a3b8" font-size="12">Projekt przesłany w terminie, zweryfikowany z koordynatorem</text>

  <!-- Card 2 -->
  <rect x="180" y="258" width="920" height="100" rx="12" fill="#0f172a" stroke="#1e293b"/>
  <rect x="180" y="258" width="4" height="100" rx="2" fill="#10b981"/>
  <text x="204" y="286" fill="#f8fafc" font-size="15" font-weight="bold">2. Zaznaczone wymiary zmian</text>
  <rect x="204" y="300" width="60" height="24" rx="4" fill="#10b981" fill-opacity="0.2"/>
  <text x="220" y="316" fill="#34d399" font-size="11" font-weight="bold">TAK</text>
  <text x="280" y="316" fill="#94a3b8" font-size="12">Wymiary naniesione na rzucie wykonawczym</text>

  <!-- Card 3 -->
  <rect x="180" y="370" width="920" height="100" rx="12" fill="#0f172a" stroke="#1e293b"/>
  <rect x="180" y="370" width="4" height="100" rx="2" fill="#f43f5e"/>
  <text x="204" y="398" fill="#f8fafc" font-size="15" font-weight="bold">3. Włączniki po dobrej stronie drzwi</text>
  <rect x="204" y="412" width="60" height="24" rx="4" fill="#f43f5e" fill-opacity="0.2"/>
  <text x="222" y="428" fill="#fb7185" font-size="11" font-weight="bold">NIE</text>
  <text x="280" y="428" fill="#94a3b8" font-size="12">W sypialni 2 włącznik koliduje ze skrzydłem drzwi – do korekty</text>

  <!-- Card 4: Signatures Summary -->
  <rect x="180" y="482" width="920" height="120" rx="12" fill="#0f172a" stroke="#1e293b"/>
  <text x="204" y="510" fill="#f8fafc" font-size="15" font-weight="bold">Podpisy stron protokołu (Architekt &amp; Koordynator)</text>
  <rect x="204" y="524" width="340" height="60" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="220" y="548" fill="#10b981" font-size="12" font-weight="bold">✓ Podpis Architekta: Złożony</text>
  <text x="220" y="568" fill="#94a3b8" font-size="11">06.11.2026 • Odręczny cyfrowy ślad</text>
  <rect x="560" y="524" width="340" height="60" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="576" y="548" fill="#10b981" font-size="12" font-weight="bold">✓ Podpis Koordynatora: Złożony</text>
  <text x="576" y="568" fill="#94a3b8" font-size="11">06.11.2026 • Odręczny cyfrowy ślad</text>

  <!-- Bottom Floating Summary Bar -->
  <rect x="180" y="620" width="920" height="54" rx="12" fill="#1e293b" stroke="#334155"/>
  <text x="204" y="652" fill="#f8fafc" font-size="13" font-weight="bold">Stan protokołu: Gotowy • Wszystkie pozycje zweryfikowane</text>
  <rect x="880" y="630" width="206" height="34" rx="8" fill="#10b981"/>
  <text x="906" y="652" fill="#022c22" font-size="12" font-weight="bold">✓ Generuj PDF &amp; Udostępnij</text>
</svg>
`;

// Mobile Screenshot SVG (750x1334)
const svgMobileScreenshot = `
<svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <!-- Mobile Screen Background -->
  <rect width="750" height="1334" fill="#090d16"/>

  <!-- Mobile Status Bar -->
  <rect width="750" height="44" fill="#0f172a"/>
  <text x="44" y="30" fill="#ffffff" font-size="15" font-weight="600">09:41</text>
  <text x="640" y="30" fill="#ffffff" font-size="14" font-weight="600">5G  100%</text>

  <!-- Mobile App Header -->
  <rect y="44" width="750" height="96" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <rect x="32" y="68" width="48" height="48" rx="12" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-opacity="0.4"/>
  <text x="96" y="92" fill="#f8fafc" font-size="18" font-weight="bold">Protokół Omawiania Projektu</text>
  <text x="96" y="112" fill="#94a3b8" font-size="13">Projekt Apartament • Architekt • Koordynator</text>
  <rect x="540" y="72" width="178" height="40" rx="8" fill="#f59e0b"/>
  <text x="560" y="97" fill="#0f172a" font-size="13" font-weight="bold">Generuj PDF</text>

  <!-- Quick Progress Bar -->
  <rect x="32" y="156" width="686" height="44" rx="10" fill="#0f172a" stroke="#1e293b"/>
  <text x="52" y="184" fill="#10b981" font-size="14" font-weight="bold">✓ 36 TAK</text>
  <text x="144" y="184" fill="#64748b" font-size="14">|</text>
  <text x="164" y="184" fill="#f43f5e" font-size="14" font-weight="bold">✕ 1 NIE</text>
  <text x="254" y="184" fill="#64748b" font-size="14">|</text>
  <text x="274" y="184" fill="#38bdf8" font-size="14" font-weight="600">Podpisy: 2/2 ✍️</text>

  <!-- Tabs Navigation -->
  <rect x="32" y="216" width="180" height="42" rx="10" fill="#f59e0b"/>
  <text x="58" y="242" fill="#0f172a" font-size="14" font-weight="bold">Wszystkie (39)</text>

  <rect x="224" y="216" width="190" height="42" rx="10" fill="#1e293b"/>
  <text x="242" y="242" fill="#cbd5e1" font-size="14" font-weight="500">Zmiany budowlane</text>

  <rect x="424" y="216" width="130" height="42" rx="10" fill="#1e293b"/>
  <text x="446" y="242" fill="#cbd5e1" font-size="14" font-weight="500">Parapet</text>

  <!-- Mobile Card 1 -->
  <rect x="32" y="280" width="686" height="200" rx="16" fill="#0f172a" stroke="#1e293b"/>
  <rect x="32" y="280" width="6" height="200" rx="3" fill="#10b981"/>
  <text x="56" y="318" fill="#f8fafc" font-size="16" font-weight="bold">1. Czy projekt był przesłany do sprawdzenia:</text>
  <rect x="56" y="338" width="180" height="48" rx="10" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-opacity="0.5"/>
  <text x="126" y="368" fill="#34d399" font-size="14" font-weight="bold">TAK</text>
  <rect x="250" y="338" width="180" height="48" rx="10" fill="#1e293b" stroke="#334155"/>
  <text x="322" y="368" fill="#94a3b8" font-size="14" font-weight="bold">NIE</text>
  <rect x="444" y="338" width="244" height="48" rx="10" fill="#1e293b" stroke="#334155"/>
  <text x="496" y="368" fill="#94a3b8" font-size="13" font-weight="bold">NIE DOTYCZY</text>
  <text x="56" y="424" fill="#94a3b8" font-size="13">Przesłano i zatwierdzono wersję v3</text>

  <!-- Mobile Card 2 -->
  <rect x="32" y="500" width="686" height="200" rx="16" fill="#0f172a" stroke="#1e293b"/>
  <rect x="32" y="500" width="6" height="200" rx="3" fill="#10b981"/>
  <text x="56" y="538" fill="#f8fafc" font-size="16" font-weight="bold">2. Zaznaczone wymiary zmian</text>
  <rect x="56" y="558" width="180" height="48" rx="10" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-opacity="0.5"/>
  <text x="126" y="588" fill="#34d399" font-size="14" font-weight="bold">TAK</text>
  <rect x="250" y="558" width="180" height="48" rx="10" fill="#1e293b" stroke="#334155"/>
  <text x="322" y="588" fill="#94a3b8" font-size="14" font-weight="bold">NIE</text>
  <rect x="444" y="558" width="244" height="48" rx="10" fill="#1e293b" stroke="#334155"/>
  <text x="496" y="588" fill="#94a3b8" font-size="13" font-weight="bold">NIE DOTYCZY</text>
  <text x="56" y="644" fill="#94a3b8" font-size="13">Zgodne z rzutem branżowym</text>

  <!-- Mobile Signatures Pad Preview -->
  <rect x="32" y="720" width="686" height="300" rx="16" fill="#0f172a" stroke="#1e293b"/>
  <text x="56" y="758" fill="#f8fafc" font-size="16" font-weight="bold">Podpisy odręczne (Architekt i Koordynator)</text>
  <rect x="56" y="776" width="638" height="100" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
  <text x="76" y="806" fill="#10b981" font-size="13" font-weight="bold">Podpis Architekta: Złożony ✓</text>
  <path d="M90 850 Q 150 820, 220 840 T 320 830" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>

  <rect x="56" y="890" width="638" height="100" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
  <text x="76" y="920" fill="#10b981" font-size="13" font-weight="bold">Podpis Koordynatora: Złożony ✓</text>
  <path d="M90 960 Q 170 930, 240 950 T 360 940" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>

  <!-- Sticky Bottom App Bar -->
  <rect y="1190" width="750" height="144" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <rect x="32" y="1210" width="686" height="60" rx="14" fill="#f59e0b"/>
  <text x="210" y="1248" fill="#0f172a" font-size="17" font-weight="bold">📄 Generuj PDF &amp; Udostępnij</text>
  <text x="260" y="1295" fill="#94a3b8" font-size="12">Podgląd i udostępnienie protokołu</text>
</svg>
`;

async function run() {
  const svgBuf = Buffer.from(svgIcon);
  const maskableBuf = Buffer.from(svgMaskable);

  // Write base SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());

  // Generate complete set of standard PWA icons for PWABuilder
  const sizes = [96, 128, 192, 256, 384, 512];
  for (const size of sizes) {
    await sharp(svgBuf)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `pwa-${size}x${size}.png`));
    console.log(`Generated pwa-${size}x${size}.png`);
  }

  // Maskable icon 512x512
  await sharp(maskableBuf)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // Apple touch icon (180x180)
  await sharp(svgBuf)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Favicon (64x64 PNG converted/saved)
  await sharp(svgBuf)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');

  // Screenshots for PWABuilder (Wide desktop + Narrow mobile)
  await sharp(Buffer.from(svgDesktopScreenshot))
    .resize(1280, 720)
    .png()
    .toFile(path.join(screenshotsDir, 'desktop-1280x720.png'));
  console.log('Generated screenshots/desktop-1280x720.png');

  await sharp(Buffer.from(svgMobileScreenshot))
    .resize(750, 1334)
    .png()
    .toFile(path.join(screenshotsDir, 'mobile-750x1334.png'));
  console.log('Generated screenshots/mobile-750x1334.png');

  console.log('All icons and screenshots created successfully!');
}

run().catch(console.error);
