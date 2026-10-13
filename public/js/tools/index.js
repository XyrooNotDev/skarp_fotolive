// tools/index.js — Tools tab: list of tools, each opens its own page
import { showToast } from "../utils/index.js";
import {
  esc,
  formatBytes,
  readImageSize,
  saveToSkarp,
  openSaveFolder,
  stampName,
  SAVE_DIR,
} from "./common.js";
import { upscaleImage, compressPdf, removeBackground } from "./ilove.js";
import { findPresets, clearAmCache } from "./amfinder.js";
import { createVideoPlayer } from "../components/player.js";

/* ---------------- strings (en / id; other languages fall back to en) ---------------- */
const S = {
  en: {
    "tools-title": "Tools",
    "tools-sub": "Handy utilities",
    back: "Back",
    "up-desc": "Make photos HD with a before/after view",
    "am-desc": "Find Alight Motion presets from a TikTok link",
    "pdf-desc": "Make PDF files smaller",
    "bg-desc": "Cut the background out of a photo",
    "wa-story-desc": "Scan WhatsApp video statuses stored on this device",
    "wifi-qr-desc": "Scan a Wi‑Fi QR code, view its password and connect",
    "hotspot-desc": "Open mobile hotspot settings when Wi‑Fi is unavailable",
    "live-camera-desc": "Take regular photos and Live Photo-style photo + video pairs",
    "live-camera-hint": "Take a regular photo or capture a 3-second motion photo. A motion photo saves a still image and a short video clip. iPhone Live Photo pairing metadata is not created by this web-based camera.",
    "camera-start": "Start camera",
    "camera-photo": "Take photo",
    "camera-live": "Capture Live Photo",
    "camera-stop": "Stop camera",
    "camera-ready": "Camera ready",
    "camera-starting": "Requesting camera permission…",
    "camera-live-working": "Capturing motion photo… keep still",
    "camera-saved-photo": "Photo saved: {path}",
    "camera-saved-live": "Motion photo saved. Still: {photo}; clip: {video}",
    "camera-error": "Camera unavailable: {msg}",
    "camera-no-mediarecorder": "This device/browser does not support video recording.",
    "hotspot-hint": "If Wi‑Fi cannot be enabled or there is no available network, open Android settings to turn on Mobile Hotspot and share your mobile data connection.",
    "hotspot-open": "Open Mobile Hotspot settings",
    "hotspot-wifi": "Open Wi‑Fi settings",
    "hotspot-note": "Android requires you to enable the hotspot manually. SKARP cannot turn it on automatically on most devices.",
    "wa-story-hint": "Only video statuses are shown. Photos and other files are hidden.",
    "wa-story-scan": "Scan WhatsApp Story",
    "wa-story-refresh": "Scan again",
    "wa-story-empty": "No WhatsApp video stories found on this device.",
    "wa-story-permission": "Storage access is required to read WhatsApp Status videos.",
    "wa-story-open": "Play video",
    "wifi-hint": "Scan a Wi‑Fi QR code. The SSID, security type and password will be shown.",
    "wifi-scan": "Scan Wi‑Fi QR",
    "wifi-scanning": "Opening scanner…",
    "wifi-ssid": "Network",
    "wifi-security": "Security",
    "wifi-password": "Password",
    "wifi-hidden": "Hidden network",
    "wifi-connect": "Connect to Wi‑Fi",
    "wifi-copied": "Password copied",
    "wifi-empty": "No Wi‑Fi QR result yet.",
    "wifi-failed": "Wi‑Fi connection failed: {msg}",
    "wifi-added": "Wi‑Fi network added. Android may ask you to confirm the connection.",
    "pick-image": "Choose a photo",
    "pick-pdf": "Choose a PDF",
    "up-hint": "Upload a photo and get an HD version. Drag the handle to compare.",
    "up-run": "Upscale photo",
    "up-scale": "Scale",
    "pdf-hint": "Pick a PDF and shrink it. The result is saved to the SKARP folder.",
    "pdf-run": "Compress PDF",
    "pdf-level": "Compression",
    "lv-low": "Light",
    "lv-recommended": "Balanced",
    "lv-extreme": "Maximum",
    "bg-hint": "Pick a photo and the background is removed. The result is a transparent PNG.",
    "bg-run": "Remove background",
    "step-session": "Connecting…",
    "step-upload": "Uploading…",
    "step-process": "Processing, this can take a minute…",
    "step-download": "Downloading result…",
    original: "Original",
    result: "Result",
    hd: "HD",
    "saved-to": "Saved to {path}",
    "saved-browser": "Downloaded as {path}",
    "open-folder": "Open folder",
    "save-again": "Save again",
    "no-gain": "This PDF is already as small as it gets, nothing was saved.",
    "saved-pct": "{pct}% smaller",
    failed: "Failed: {msg}",
    "net-hint": "Network tools work inside the SKARP app. A plain browser usually blocks these requests (CORS).",
    "am-hint": "Paste a TikTok video link. SKARP reads the description, bio, link-in-bio and comments to find presets.",
    "am-ph": "Paste TikTok link…",
    "am-run": "Find presets",
    "am-rescan": "Scan again",
    paste: "Paste",
    "st-resolve": "Reading the link",
    "st-video": "Fetching video data",
    "st-profile": "Fetching profile and bio link",
    "st-comments": "Reading comments",
    "st-replies": "Checking comment replies",
    "st-links": "Following links",
    "st-titles": "Fetching preset titles",
    "st-cache": "Loaded from cache",
    video: "Video",
    uploader: "Uploader",
    views: "Views",
    likes: "Likes",
    comments: "Comments",
    shares: "Shares",
    posted: "Posted",
    presets: "Presets found",
    "no-presets": "No preset found",
    "no-presets-d": "Checked the description, bio, link-in-bio and comments. Try again later or open the video to look for it yourself.",
    analysis: "Comment analysis",
    "an-comments": "Comments scanned",
    "an-replies": "Replies scanned",
    "an-links": "Comments with links",
    "an-pinned": "Pinned comment",
    "an-by": "Links in comments",
    "other-links": "Other links",
    open: "Open",
    copy: "Copy",
    copied: "Link copied",
    "src-description": "Description",
    "src-bio": "Bio",
    "src-bioLink": "Link in bio",
    "src-comment": "Comment",
    "src-pinned": "Pinned",
    "src-uploader": "From uploader",
    "src-unknown": "Link",
    "resolved-title": "Link resolved",
    "not-alight": "This link does not lead to an Alight Motion preset.",
    "clear-cache": "Clear cache",
    "cache-cleared": "Cache cleared",
    "open-video": "Open video",
  },
  id: {
    "tools-title": "Tools",
    "tools-sub": "Alat bantu praktis",
    back: "Kembali",
    "up-desc": "Foto jadi HD, lengkap dengan perbandingan",
    "am-desc": "Cari preset Alight Motion dari link TikTok",
    "pdf-desc": "Kecilkan ukuran file PDF",
    "bg-desc": "Hapus latar belakang foto",
    "wa-story-desc": "Ambil status video WhatsApp yang tersimpan di perangkat",
    "wifi-qr-desc": "Scan QR Wi‑Fi, lihat password, lalu sambungkan",
    "hotspot-desc": "Buka pengaturan hotspot seluler saat Wi‑Fi tidak tersedia",
    "live-camera-desc": "Ambil foto biasa dan Foto Live berupa foto + video",
    "live-camera-hint": "Ambil foto biasa atau foto bergerak berdurasi 3 detik. Foto bergerak menyimpan gambar diam dan klip video pendek. Kamera berbasis web ini belum membuat metadata pasangan Apple Live Photo.",
    "camera-start": "Mulai kamera",
    "camera-photo": "Ambil foto",
    "camera-live": "Ambil Foto Live",
    "camera-stop": "Matikan kamera",
    "camera-ready": "Kamera siap",
    "camera-starting": "Meminta izin kamera…",
    "camera-live-working": "Mengambil foto bergerak… diam sebentar",
    "camera-saved-photo": "Foto tersimpan: {path}",
    "camera-saved-live": "Foto bergerak tersimpan. Foto: {photo}; video: {video}",
    "camera-error": "Kamera tidak tersedia: {msg}",
    "camera-no-mediarecorder": "Perangkat/browser ini tidak mendukung perekaman video.",
    "hotspot-hint": "Jika Wi‑Fi tidak bisa diaktifkan atau tidak ada jaringan, buka pengaturan Android untuk menyalakan Hotspot Seluler dan membagikan koneksi data seluler.",
    "hotspot-open": "Buka pengaturan Hotspot Seluler",
    "hotspot-wifi": "Buka pengaturan Wi‑Fi",
    "hotspot-note": "Android mengharuskan Anda menyalakan hotspot secara manual. SKARP tidak bisa menyalakannya otomatis di sebagian besar perangkat.",
    "wa-story-hint": "Hanya status berbentuk video yang ditampilkan. Foto dan file lain disembunyikan.",
    "wa-story-scan": "Scan Story WhatsApp",
    "wa-story-refresh": "Scan ulang",
    "wa-story-empty": "Tidak ada story video WhatsApp di perangkat ini.",
    "wa-story-permission": "Akses penyimpanan diperlukan untuk membaca video Status WhatsApp.",
    "wa-story-open": "Putar video",
    "wifi-hint": "Scan QR Wi‑Fi. SSID, jenis keamanan, dan password akan ditampilkan.",
    "wifi-scan": "Scan QR Wi‑Fi",
    "wifi-scanning": "Membuka scanner…",
    "wifi-ssid": "Jaringan",
    "wifi-security": "Keamanan",
    "wifi-password": "Password",
    "wifi-hidden": "Jaringan tersembunyi",
    "wifi-connect": "Sambungkan Wi‑Fi",
    "wifi-copied": "Password disalin",
    "wifi-empty": "Belum ada hasil QR Wi‑Fi.",
    "wifi-failed": "Gagal menyambungkan Wi‑Fi: {msg}",
    "wifi-added": "Jaringan Wi‑Fi ditambahkan. Android mungkin meminta konfirmasi untuk menyambungkan.",
    "pick-image": "Pilih foto",
    "pick-pdf": "Pilih PDF",
    "up-hint": "Upload foto, dapatkan versi HD. Geser pegangan untuk membandingkan.",
    "up-run": "HD-kan foto",
    "up-scale": "Skala",
    "pdf-hint": "Pilih PDF lalu kecilkan. Hasilnya masuk ke folder SKARP.",
    "pdf-run": "Compress PDF",
    "pdf-level": "Kompresi",
    "lv-low": "Ringan",
    "lv-recommended": "Seimbang",
    "lv-extreme": "Maksimal",
    "bg-hint": "Pilih foto, latar belakangnya dihapus. Hasilnya PNG transparan.",
    "bg-run": "Hapus latar",
    "step-session": "Menyambung…",
    "step-upload": "Mengunggah…",
    "step-process": "Memproses, bisa sampai semenit…",
    "step-download": "Mengunduh hasil…",
    original: "Asli",
    result: "Hasil",
    hd: "HD",
    "saved-to": "Tersimpan di {path}",
    "saved-browser": "Diunduh sebagai {path}",
    "open-folder": "Buka folder",
    "save-again": "Simpan lagi",
    "no-gain": "PDF ini sudah sekecil mungkin, tidak ada yang disimpan.",
    "saved-pct": "Lebih kecil {pct}%",
    failed: "Gagal: {msg}",
    "net-hint": "Tools jaringan jalan di dalam aplikasi SKARP. Browser biasa umumnya memblokir request ini (CORS).",
    "am-hint": "Tempel link video TikTok. SKARP membaca deskripsi, bio, link bio, dan komentar untuk mencari preset.",
    "am-ph": "Tempel link TikTok…",
    "am-run": "Cari preset",
    "am-rescan": "Scan ulang",
    paste: "Tempel",
    "st-resolve": "Membaca link",
    "st-video": "Mengambil data video",
    "st-profile": "Mengambil profil dan link bio",
    "st-comments": "Membaca komentar",
    "st-replies": "Mengecek balasan komentar",
    "st-links": "Menelusuri link",
    "st-titles": "Mengambil judul preset",
    "st-cache": "Diambil dari cache",
    video: "Video",
    uploader: "Pengunggah",
    views: "Ditonton",
    likes: "Suka",
    comments: "Komentar",
    shares: "Dibagikan",
    posted: "Diunggah",
    presets: "Preset ditemukan",
    "no-presets": "Preset tidak ditemukan",
    "no-presets-d": "Sudah dicek di deskripsi, bio, link bio, dan komentar. Coba lagi nanti atau buka videonya dan cari sendiri.",
    analysis: "Analisis komentar",
    "an-comments": "Komentar dipindai",
    "an-replies": "Balasan dipindai",
    "an-links": "Komentar berisi link",
    "an-pinned": "Komentar disematkan",
    "an-by": "Link di komentar",
    "other-links": "Link lain",
    open: "Buka",
    copy: "Salin",
    copied: "Link disalin",
    "src-description": "Deskripsi",
    "src-bio": "Bio",
    "src-bioLink": "Link bio",
    "src-comment": "Komentar",
    "src-pinned": "Disematkan",
    "src-uploader": "Dari pengunggah",
    "src-unknown": "Link",
    "resolved-title": "Link berhasil dibuka",
    "not-alight": "Link ini tidak mengarah ke preset Alight Motion.",
    "clear-cache": "Hapus cache",
    "cache-cleared": "Cache dihapus",
    "open-video": "Buka video",
  },
};
const lang = () => (localStorage.getItem("skarp_lang") || "en") === "id" ? "id" : "en";
const t = (k, vars) => {
  let s = S[lang()][k] ?? S.en[k] ?? k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
  return s;
};
const locale = () => (localStorage.getItem("skarp_lang") || "en");

/* ---------------- icons ---------------- */
const ic = (d, size = 24) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor"><path d="${d}"/></svg>`;
const ICON = {
  up: "M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z",
  am: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 12 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 12 14 9.5 14z",
  wa: "M12 2a10 10 0 0 0-8.66 15l-1.1 4.02L6.4 19.9A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.08-1.12l-.29-.17-2.43.67.66-2.37-.18-.3A8 8 0 1 1 12 20zm4.39-5.84c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z",
  wifi: "M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-4.2-5.3a6 6 0 0 1 8.4 0l1.4-1.4a8 8 0 0 0-11.2 0l1.4 1.4zm-3.2-3.2a10.5 10.5 0 0 1 14.8 0l1.4-1.4a12.5 12.5 0 0 0-17.6 0l1.4 1.4zM1.4 8.8a15 15 0 0 1 21.2 0l-1.4 1.4a13 13 0 0 0-18.4 0L1.4 8.8z",
  pdf: "M20 2H8c-1.1 0-1.9 0.9-1.9 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z",
  bg: "M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z",
  back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
  chev: "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z",
  img: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  file: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z",
  paste: "M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z",
  check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
};

/* ---------------- skeleton markup ---------------- */
const subHeader = (title) =>
  `<div class="sub-page-header"><button class="back-btn-settings" data-tool-back aria-label="Back">${ic(ICON.back, 22)}</button><h3>${title}</h3></div>`;

const fileTool = ({ id, title, iconKey, hint, pick, accept, run, extra = "" }) => `
<section class="tool-sub-page hidden" id="tool-${id}">
  ${subHeader(title)}
  <p class="tool-hint" data-tt="${hint}"></p>
  <label class="tool-drop" id="${id}Drop">
    <input type="file" accept="${accept}" id="${id}File" hidden />
    <span class="tool-drop-icon">${ic(iconKey === "pdf" ? ICON.file : ICON.img, 30)}</span>
    <span class="tool-drop-text" data-tt="${pick}"></span>
    <small class="tool-drop-info" id="${id}Info"></small>
  </label>
  <img class="tool-preview hidden" id="${id}Preview" alt="" />
  ${extra}
  <button class="tool-btn" id="${id}Run" disabled data-tt="${run}"></button>
  <div class="tool-status hidden" id="${id}Status"></div>
  <div class="tool-result hidden" id="${id}Result"></div>
</section>`;

const seg = (id, labelKey, items, activeIndex = 0) => `
<div class="tool-opt">
  <span class="tool-opt-label" data-tt="${labelKey}"></span>
  <div class="tool-seg" id="${id}">
    ${items.map(([v, label, key], i) => `<button type="button" data-v="${v}" class="${i === activeIndex ? "active" : ""}" ${key ? `data-tt="${key}"` : ""}>${label || ""}</button>`).join("")}
  </div>
</div>`;

function buildPage() {
  return `
<div id="toolsMenu">
  <div class="page-header"><h2 data-tt="tools-title"></h2><p data-tt="tools-sub"></p></div>
  <div class="settings-menu-list tool-list">
    ${[
      ["upscale", "Image Upscale", ICON.up, "up-desc"],
      ["am", "Preset AM Finder", ICON.am, "am-desc"],
      ["pdf", "Compress PDF", ICON.pdf, "pdf-desc"],
      ["bg", "Remove BG", ICON.bg, "bg-desc"],
      ["wa-story", "WhatsApp Video Story", ICON.wa, "wa-story-desc"],
      ["wifi-qr", "Wi‑Fi QR Scanner", ICON.wifi, "wifi-qr-desc"],
      ["hotspot", "Mobile Hotspot", ICON.wifi, "hotspot-desc"],
      ["live-camera", "Live Photo Camera", ICON.img, "live-camera-desc"],
    ]
      .map(
        ([id, name, icon, desc]) => `
    <div class="tool-card" data-tool="${id}" role="button" tabindex="0">
      <div class="menu-icon">${ic(icon)}</div>
      <div class="menu-text"><div class="menu-title">${name}</div><div class="menu-desc" data-tt="${desc}"></div></div>
      <span class="tool-chev">${ic(ICON.chev, 22)}</span>
    </div>`,
      )
      .join("")}
  </div>
</div>

${fileTool({
  id: "upscale",
  title: "Image Upscale",
  iconKey: "img",
  hint: "up-hint",
  pick: "pick-image",
  accept: "image/*",
  run: "up-run",
  extra: seg("upScale", "up-scale", [["2", "2×"], ["4", "4×"]]),
})}

<section class="tool-sub-page hidden" id="tool-am">
  ${subHeader("Preset AM Finder")}
  <p class="tool-hint" data-tt="am-hint"></p>
  <div class="tool-input">
    <input type="text" id="amInput" data-tt-ph="am-ph" autocomplete="off" autocapitalize="off" spellcheck="false" />
    <button type="button" class="tool-input-btn" id="amPaste" aria-label="Paste">${ic(ICON.paste, 20)}</button>
  </div>
  <button class="tool-btn" id="amRun" data-tt="am-run"></button>
  <div class="tool-status hidden" id="amStatus"></div>
  <div class="tool-result hidden" id="amResult"></div>
</section>

${fileTool({
  id: "pdf",
  title: "Compress PDF",
  iconKey: "pdf",
  hint: "pdf-hint",
  pick: "pick-pdf",
  accept: "application/pdf,.pdf",
  run: "pdf-run",
  extra: seg("pdfLevel", "pdf-level", [["low", "", "lv-low"], ["recommended", "", "lv-recommended"], ["extreme", "", "lv-extreme"]], 1),
})}

${fileTool({
  id: "bg",
  title: "Remove BG",
  iconKey: "img",
  hint: "bg-hint",
  pick: "pick-image",
  accept: "image/*",
  run: "bg-run",
})}

<section class="tool-sub-page hidden" id="tool-wa-story">
  ${subHeader("WhatsApp Video Story")}
  <p class="tool-hint" data-tt="wa-story-hint"></p>
  <button type="button" class="tool-btn" id="waStoryRun" data-tt="wa-story-scan"></button>
  <div class="tool-status hidden" id="waStoryStatus"></div>
  <div class="tool-result hidden" id="waStoryResult"></div>
</section>

<section class="tool-sub-page hidden" id="tool-wifi-qr">
  ${subHeader("Wi‑Fi QR Scanner")}
  <p class="tool-hint" data-tt="wifi-hint"></p>
  <button type="button" class="tool-btn" id="wifiQrRun" data-tt="wifi-scan"></button>
  <div class="tool-status hidden" id="wifiQrStatus"></div>
  <div class="tool-result hidden" id="wifiQrResult"></div>
</section>
${hotspotPage}
<section class="tool-sub-page hidden" id="tool-live-camera">
  ${subHeader("Live Photo Camera")}
  <p class="tool-hint" data-tt="live-camera-hint"></p>
  <div class="tool-card-static live-camera-card">
    <video id="liveCameraPreview" class="live-camera-preview" autoplay playsinline muted></video>
    <canvas id="liveCameraCanvas" class="hidden"></canvas>
    <div class="live-camera-controls">
      <button type="button" class="tool-btn" id="liveCameraStart" data-tt="camera-start"></button>
      <button type="button" class="tool-btn" id="liveCameraPhoto" disabled data-tt="camera-photo"></button>
      <button type="button" class="tool-btn" id="liveCameraLive" disabled data-tt="camera-live"></button>
      <button type="button" class="tool-btn-sec" id="liveCameraStop" disabled data-tt="camera-stop"></button>
    </div>
    <div class="tool-status hidden" id="liveCameraStatus"></div>
    <div class="tool-result hidden" id="liveCameraResult"></div>
  </div>
</section>`;
}

/* ---------------- helpers ---------------- */
const $ = (id) => document.getElementById(id);
let root;

function applyLang() {
  root.querySelectorAll("[data-tt]").forEach((el) => (el.textContent = t(el.dataset.tt)));
  root.querySelectorAll("[data-tt-ph]").forEach((el) => (el.placeholder = t(el.dataset.ttPh)));
}

function setStatus(el, html, kind = "busy") {
  el.className = `tool-status ${kind}`;
  el.innerHTML = html;
}
const spinner = '<span class="tool-spin"></span>';
const hideEl = (el) => el.classList.add("hidden");
const showEl = (el) => el.classList.remove("hidden");

function errorHtml(e) {
  let msg = e?.message || String(e);
  const hint =
    !window.Capacitor?.isNativePlatform?.() && /fetch|network|load failed/i.test(msg)
      ? `<small>${esc(t("net-hint"))}</small>`
      : "";
  return `<strong>${esc(t("failed", { msg }))}</strong>${hint}`;
}

function bindSeg(el) {
  el.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-v]");
    if (!b) return;
    el.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
  });
  return () => el.querySelector("button.active")?.dataset.v;
}

/* ---------------- before / after slider ---------------- */
function mountCompare(host, { beforeUrl, afterUrl, beforeLabel, afterLabel, checker = false }) {
  host.innerHTML = `
  <div class="cmp ${checker ? "cmp-checker" : ""}" style="--pos:50%">
    <img class="cmp-img cmp-after" src="${afterUrl}" alt="" draggable="false" />
    <div class="cmp-before"><img class="cmp-img" src="${beforeUrl}" alt="" draggable="false" /></div>
    <div class="cmp-handle"><span>${ic("M8.59 16.59L4 12l4.59-4.59L10 8.83 6.83 12 10 15.17zM15.41 7.41L20 12l-4.59 4.59L14 15.17 17.17 12 14 8.83z", 20)}</span></div>
    <span class="cmp-tag cmp-tag-l">${esc(beforeLabel)}</span>
    <span class="cmp-tag cmp-tag-r">${esc(afterLabel)}</span>
  </div>`;
  const cmp = host.querySelector(".cmp");
  const after = cmp.querySelector(".cmp-after");
  after.addEventListener("load", () => {
    if (after.naturalWidth) cmp.style.aspectRatio = `${after.naturalWidth} / ${after.naturalHeight}`;
  });
  const move = (clientX) => {
    const r = cmp.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    cmp.style.setProperty("--pos", p + "%");
  };
  cmp.addEventListener("pointerdown", (e) => {
    cmp.setPointerCapture(e.pointerId);
    move(e.clientX);
    cmp._drag = true;
  });
  cmp.addEventListener("pointermove", (e) => cmp._drag && move(e.clientX));
  const end = () => (cmp._drag = false);
  cmp.addEventListener("pointerup", end);
  cmp.addEventListener("pointercancel", end);
}

/* ---------------- save + result footer ---------------- */
async function saveAndReport(bytes, prefix, ext) {
  const name = stampName(prefix, ext);
  const saved = await saveToSkarp(bytes, name);
  return { name, saved };
}

function savedLine(saved) {
  const msg = saved.native ? t("saved-to", { path: saved.path }) : t("saved-browser", { path: saved.path });
  return `<div class="tool-saved">${ic(ICON.check, 18)}<span>${esc(msg)}</span></div>`;
}

function footerButtons(canOpen, onAgain) {
  const wrap = document.createElement("div");
  wrap.className = "tool-actions";
  if (canOpen) {
    const open = document.createElement("button");
    open.className = "tool-btn-sec";
    open.textContent = t("open-folder");
    open.addEventListener("click", () => openSaveFolder());
    wrap.appendChild(open);
  }
  const again = document.createElement("button");
  again.className = "tool-btn-sec";
  again.textContent = t("save-again");
  again.addEventListener("click", onAgain);
  wrap.appendChild(again);
  return wrap;
}

/* ---------------- generic file tool ---------------- */
function mountFileTool({ id, kind, getOption, run, prefix, renderResult }) {
  const input = $(`${id}File`);
  const info = $(`${id}Info`);
  const preview = $(`${id}Preview`);
  const runBtn = $(`${id}Run`);
  const status = $(`${id}Status`);
  const result = $(`${id}Result`);
  let file = null;
  let previewUrl = null;
  let busy = false;

  input.addEventListener("change", async () => {
    file = input.files?.[0] || null;
    hideEl(result);
    hideEl(status);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    if (!file) {
      info.textContent = "";
      hideEl(preview);
      runBtn.disabled = true;
      return;
    }
    let extra = "";
    if (kind === "image") {
      previewUrl = URL.createObjectURL(file);
      preview.src = previewUrl;
      showEl(preview);
      try {
        const { width, height } = await readImageSize(file);
        extra = ` · ${width}×${height}`;
      } catch (_) {}
    }
    info.textContent = `${file.name} · ${formatBytes(file.size)}${extra}`;
    runBtn.disabled = false;
  });

  runBtn.addEventListener("click", async () => {
    if (!file || busy) return;
    busy = true;
    runBtn.disabled = true;
    hideEl(result);
    const onStep = (step, frac) => {
      const pct = frac != null && step === "upload" ? ` ${Math.round(frac * 100)}%` : "";
      setStatus(status, `${spinner}<span>${esc(t("step-" + step))}${pct}</span>`);
    };
    onStep("session");
    try {
      const out = await run(file, getOption?.(), onStep);
      hideEl(status);
      if (kind === "image") hideEl(preview);
      result.innerHTML = "";
      showEl(result);
      await renderResult({ file, out, result, prefix, previewUrl });
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      console.warn("[tools]", e);
      setStatus(status, errorHtml(e), "error");
    } finally {
      busy = false;
      runBtn.disabled = false;
    }
  });
}

async function renderImageResult({ file, out, result, prefix, label, checker }) {
  const blob = new Blob([out.bytes], { type: out.ext === "png" ? "image/png" : out.ext === "webp" ? "image/webp" : "image/jpeg" });
  const afterUrl = URL.createObjectURL(blob);
  const beforeUrl = URL.createObjectURL(file);
  const cmpHost = document.createElement("div");
  result.appendChild(cmpHost);
  mountCompare(cmpHost, {
    beforeUrl,
    afterUrl,
    beforeLabel: t("original"),
    afterLabel: label,
    checker,
  });
  const meta = document.createElement("div");
  meta.className = "tool-meta";
  result.appendChild(meta);
  try {
    const [a, b] = await Promise.all([readImageSize(file), readImageSize(blob)]);
    meta.textContent = `${a.width}×${a.height} → ${b.width}×${b.height}  ·  ${formatBytes(file.size)} → ${formatBytes(out.bytes.length)}`;
  } catch (_) {
    meta.textContent = `${formatBytes(file.size)} → ${formatBytes(out.bytes.length)}`;
  }
  const savedBox = document.createElement("div");
  result.appendChild(savedBox);
  const doSave = async () => {
    try {
      const { saved } = await saveAndReport(out.bytes, prefix, out.ext);
      savedBox.innerHTML = savedLine(saved);
      showToast(saved.native ? t("saved-to", { path: saved.path }) : t("saved-browser", { path: saved.path }));
      return saved;
    } catch (e) {
      savedBox.innerHTML = `<div class="tool-status error"><strong>${esc(t("failed", { msg: e.message || e }))}</strong></div>`;
      return null;
    }
  };
  const saved = await doSave();
  result.appendChild(footerButtons(!!saved?.native, doSave));
}

/* ---------------- Preset AM Finder UI ---------------- */
const fmtNum = (n) => (n == null ? "–" : new Intl.NumberFormat(locale(), { notation: "compact", maximumFractionDigits: 1 }).format(n));
const fmtFull = (n) => (n == null ? "" : new Intl.NumberFormat(locale()).format(n));

function srcLabel(p) {
  const base = String(p.source || "unknown").split(":")[0];
  const parts = [];
  if (p.byAuthor) parts.push(t("src-uploader"));
  parts.push(S[lang()]["src-" + base] ? t("src-" + base) : t("src-unknown"));
  if (p.pinned) parts.push(t("src-pinned"));
  let s = parts.join(" · ");
  if (p.detail) s += ` ${p.detail}`;
  return s;
}

async function copyText(text) {
  try {
    const cb = window.Capacitor?.Plugins?.Clipboard;
    if (cb?.write) await cb.write({ string: text });
    else await navigator.clipboard.writeText(text);
    showToast(t("copied"));
  } catch (_) {}
}

function presetCard(p) {
  const title = p.title || (p.type === "5mb" ? "Alight Motion" : "Preset");
  const badge = p.type === "5mb" ? "5MB" : "XML";
  return `
  <div class="am-preset">
    <div class="am-thumb">${p.thumb ? `<img src="${esc(p.thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : ic(ICON.am, 26)}</div>
    <div class="am-info">
      <div class="am-title">${esc(title)}</div>
      <div class="am-tags"><span class="am-badge">${badge}</span>${p.size ? `<span class="am-badge am-badge-soft">${esc(p.size)}</span>` : ""}</div>
      <div class="am-src">${esc(srcLabel(p))}</div>
      <div class="am-links">
        <a class="tool-btn-sec" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(t("open"))}</a>
        <button class="tool-btn-sec" data-copy="${esc(p.url)}">${esc(t("copy"))}</button>
      </div>
    </div>
  </div>`;
}

function renderAm(res, host) {
  if (res.mode === "resolve") {
    host.innerHTML = res.isAlight
      ? `<div class="tool-card-static"><h4>${esc(t("resolved-title"))}</h4>${presetCard({ type: "5mb", url: res.resolved, title: res.title, thumb: res.thumb, source: "unknown" })}</div>`
      : `<div class="tool-status error"><strong>${esc(t("not-alight"))}</strong><small>${esc(res.resolved || "")}</small></div>`;
    return;
  }
  const v = res.video || {};
  const a = res.authorDetail || {};
  const st = v.stats || {};
  const sc = res.scanned || {};
  const posted = v.createTime
    ? new Date(v.createTime * 1000).toLocaleDateString(locale(), { year: "numeric", month: "short", day: "numeric" })
    : null;
  const stat = (label, n) => `<div class="am-stat" title="${esc(fmtFull(n))}"><b>${esc(fmtNum(n))}</b><span>${esc(label)}</span></div>`;

  let html = `
  <div class="tool-card-static">
    <h4>${esc(t("video"))}</h4>
    <div class="am-author">
      <div class="am-avatar">
        ${a.avatar ? `<img class="am-avatar-img" src="${esc(a.avatar)}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex';" /><span class="am-avatar-initial" style="display:none;">${esc((a.nickname || a.uniqueId || "?").trim().charAt(0).toUpperCase())}</span>` : `<span class="am-avatar-initial">${esc((a.nickname || a.uniqueId || "?").trim().charAt(0).toUpperCase())}</span>`}
      </div>
      <div>
        <div class="am-nick">${esc(a.nickname || a.uniqueId || "")}</div>
        <div class="am-handle">${a.uniqueId ? "@" + esc(a.uniqueId) : ""}${posted ? ` · ${esc(t("posted"))} ${esc(posted)}` : ""}</div>
      </div>
    </div>
    ${v.playUrl || res.videoUrl || v.cover ? `<div class="am-video-preview-box" id="amVideoContainer"></div>` : ""}
    ${v.description ? `<p class="am-desc">${esc(v.description)}</p>` : ""}
    <div class="am-stats">${stat(t("views"), st.views)}${stat(t("likes"), st.likes)}${stat(t("comments"), st.comments)}${stat(t("shares"), st.shares)}</div>
    ${a.bio ? `<p class="am-bio">${esc(a.bio)}</p>` : ""}
    <div class="am-links"><a class="tool-btn-sec" href="${esc(res.videoUrl)}" target="_blank" rel="noopener">${esc(t("open-video"))}</a></div>
  </div>`;

  html += `<div class="tool-card-static"><h4>${esc(res.found ? t("presets") + " (" + res.presetLinks.length + ")" : t("no-presets"))}</h4>`;
  html += res.found ? res.presetLinks.map(presetCard).join("") : `<p class="am-desc">${esc(t("no-presets-d"))}</p>`;
  html += `</div>`;

  const row = (label, val) => `<div class="am-row"><span>${esc(label)}</span><b>${esc(val)}</b></div>`;
  html += `<div class="tool-card-static"><h4>${esc(t("analysis"))}</h4>
    ${row(t("an-comments"), fmtFull(sc.comments ?? 0))}
    ${row(t("an-replies"), fmtFull(sc.replies ?? 0))}
    ${row(t("an-links"), fmtFull(sc.commentsWithLinks ?? 0))}
    ${sc.pinnedComment ? `<div class="am-pinned"><span>${esc(t("an-pinned"))}</span><p>${esc(sc.pinnedComment)}</p></div>` : ""}`;
  if (res.commentLinks?.length) {
    html += `<div class="am-sub">${esc(t("an-by"))}</div>` +
      res.commentLinks
        .map(
          (c) => `<div class="am-linkrow"><div><div class="am-linkuser">${esc(c.user)}${c.pinned ? " 📌" : ""}${c.byAuthor ? " ✓" : ""}${c.digg ? ` · ♥ ${esc(fmtNum(c.digg))}` : ""}</div><div class="am-linkurl">${esc(c.url)}</div></div><button class="tool-btn-sec" data-copy="${esc(c.url)}">${esc(t("copy"))}</button></div>`,
        )
        .join("");
  }
  if (res.otherLinks?.length) {
    html += `<div class="am-sub">${esc(t("other-links"))}</div>` +
      res.otherLinks
        .map((o) => `<div class="am-linkrow"><div><div class="am-linkurl">${esc(o.url)}</div></div><button class="tool-btn-sec" data-copy="${esc(o.url)}">${esc(t("copy"))}</button></div>`)
        .join("");
  }
  html += `</div>`;
  host.innerHTML = html;

  const box = host.querySelector("#amVideoContainer");
  if (box && (v.playUrl || res.videoUrl)) {
    const player = createVideoPlayer(
      {
        url: v.playUrl || res.videoUrl,
        title: v.description || a.nickname || "TikTok Video",
        thumbnail: v.cover || "",
        type: "video/mp4",
      },
      0,
      v.cover || ""
    );
    box.appendChild(player);
    if (typeof player._tryAutoPlay === "function") {
      setTimeout(() => player._tryAutoPlay(), 120);
    }
  }
}

function mountAm() {
  const input = $("amInput");
  const runBtn = $("amRun");
  const status = $("amStatus");
  const result = $("amResult");
  let busy = false;
  let scannedOnce = false;

  $("amPaste").addEventListener("click", async () => {
    try {
      const cb = window.Capacitor?.Plugins?.Clipboard;
      let text = "";
      if (cb?.read) text = (await cb.read())?.value || "";
      else text = await navigator.clipboard.readText();
      if (text) input.value = text.trim();
    } catch (_) {}
  });

  result.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (b) copyText(b.dataset.copy);
  });

  const run = async (noCache) => {
    const link = input.value.trim();
    if (!link || busy) return;
    busy = true;
    runBtn.disabled = true;
    hideEl(result);
    const done = [];
    let current = "";
    const paint = () =>
      setStatus(
        status,
        `<div class="am-steps">${done.map((s) => `<div class="am-step ok">${ic(ICON.check, 16)}<span>${esc(s)}</span></div>`).join("")}${current ? `<div class="am-step">${spinner}<span>${esc(current)}</span></div>` : ""}</div>`,
      );
    const onLog = (key) => {
      if (current) done.push(current);
      current = t("st-" + key);
      paint();
    };
    paint();
    try {
      const res = await findPresets(link, { onLog, noCache });
      hideEl(status);
      renderAm(res, result);
      showEl(result);
      result.scrollIntoView({ behavior: "smooth", block: "start" });
      scannedOnce = true;
      runBtn.textContent = t("am-rescan");
    } catch (e) {
      console.warn("[tools/am]", e);
      setStatus(status, errorHtml(e), "error");
    } finally {
      busy = false;
      runBtn.disabled = false;
    }
  };
  runBtn.addEventListener("click", () => run(scannedOnce));
  input.addEventListener("keydown", (e) => e.key === "Enter" && run(false));
  input.addEventListener("input", () => {
    scannedOnce = false;
    runBtn.textContent = t("am-run");
  });
}


/* ---------------- WhatsApp video stories ---------------- */
function getNativeBridge() {
  return window.SkarpMainBridge || null;
}

function renderWhatsAppStories(host, items) {
  if (!items?.length) {
    host.innerHTML = `<div class="tool-card-static wa-empty"><div class="wa-empty-icon">${ic(ICON.wa, 34)}</div><h4>${esc(t("wa-story-empty"))}</h4></div>`;
    return;
  }
  host.innerHTML = items.map((item, index) => `
    <div class="tool-card-static wa-story-card">
      <div class="wa-story-head">
        <div><div class="wa-story-title">WhatsApp Story</div><div class="wa-story-name">${esc(item.name || `Video ${index + 1}`)}</div></div>
        <span class="am-badge">VIDEO</span>
      </div>
      <div class="wa-story-video" id="waStoryVideo${index}"></div>
      <div class="wa-story-meta">${esc(formatBytes(Number(item.size || 0)))}${item.modified ? ` · ${esc(new Date(item.modified).toLocaleString(locale()))}` : ""}</div>
    </div>`).join("");

  items.forEach((item, index) => {
    const box = host.querySelector(`#waStoryVideo${index}`);
    if (!box || !item.uri) return;
    const player = createVideoPlayer({
      url: item.uri,
      rawUri: item.uri,
      isLocal: true,
      title: item.name || "WhatsApp Story",
      type: "video/mp4"
    }, index, "");
    box.appendChild(player);
  });
}

async function scanWhatsAppStories() {
  const status = $("waStoryStatus");
  const result = $("waStoryResult");
  const btn = $("waStoryRun");
  const bridge = getNativeBridge();
  if (!bridge?.getWhatsAppVideoStatuses) {
    setStatus(status, `<strong>${esc(t("failed", { msg: "Native Android bridge tidak tersedia." }))}</strong>`, "error");
    return;
  }
  btn.disabled = true;
  hideEl(result);
  setStatus(status, `${spinner}<span>${esc(t("wa-story-scan"))}</span>`);
  try {
    let raw = bridge.getWhatsAppVideoStatuses();
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (data?.permission === false) {
      setStatus(status, `<strong>${esc(t("wa-story-permission"))}</strong>`, "error");
      if (bridge.requestAllFilesPermission) bridge.requestAllFilesPermission();
      return;
    }
    hideEl(status);
    renderWhatsAppStories(result, data?.items || []);
    showEl(result);
  } catch (e) {
    setStatus(status, errorHtml(e), "error");
  } finally {
    btn.disabled = false;
  }
}

/* ---------------- Wi-Fi QR scanner ---------------- */
function parseNativeWifiResult(raw) {
  try { return typeof raw === "string" ? JSON.parse(raw) : raw; }
  catch (_) { return { ok: false, message: "Hasil scanner tidak valid." }; }
}

function renderWifiResult(data, host) {
  if (!data?.ok) {
    host.innerHTML = `<div class="tool-status error"><strong>${esc(data?.message || t("wifi-empty"))}</strong></div>`;
    return;
  }
  const security = data.type || "nopass";
  host.innerHTML = `
    <div class="tool-card-static wifi-result-card">
      <div class="wifi-result-head">
        <div class="wifi-result-icon">${ic(ICON.wifi, 28)}</div>
        <div><h4>${esc(data.ssid || "Wi‑Fi")}</h4><span>${esc(security)}${data.hidden ? ` · ${esc(t("wifi-hidden"))}` : ""}</span></div>
      </div>
      <div class="wifi-info-row"><span>${esc(t("wifi-ssid"))}</span><b>${esc(data.ssid || "—")}</b></div>
      <div class="wifi-info-row"><span>${esc(t("wifi-security"))}</span><b>${esc(security)}</b></div>
      <div class="wifi-password-row">
        <div><span>${esc(t("wifi-password"))}</span><b id="wifiPasswordValue">${esc(data.password || "(kosong)")}</b></div>
        <button type="button" class="tool-btn-sec" id="wifiCopyPassword">${esc(t("copy"))}</button>
      </div>
      <button type="button" class="tool-btn" id="wifiConnectBtn">${esc(t("wifi-connect"))}</button>
      <div class="tool-status hidden" id="wifiConnectStatus"></div>
    </div>`;
  host.querySelector("#wifiCopyPassword")?.addEventListener("click", () => copyText(data.password || ""));
  host.querySelector("#wifiConnectBtn")?.addEventListener("click", () => {
    const bridge = getNativeBridge();
    if (!bridge?.connectWifi) return;
    const status = host.querySelector("#wifiConnectStatus");
    try {
      const raw = bridge.connectWifi(data.ssid || "", data.password || "", data.type || "nopass", !!data.hidden);
      const res = parseNativeWifiResult(raw);
      if (res.ok) setStatus(status, `<span>${esc(t("wifi-added"))}</span>`, "success");
      else setStatus(status, `<strong>${esc(t("wifi-failed", { msg: res.message || "unknown" }))}</strong>`, "error");
    } catch (e) {
      setStatus(status, `<strong>${esc(t("wifi-failed", { msg: e.message || e }))}</strong>`, "error");
    }
  });
}

function scanWifiQr() {
  const bridge = getNativeBridge();
  const status = $("wifiQrStatus");
  const result = $("wifiQrResult");
  const btn = $("wifiQrRun");
  if (!bridge?.scanWifiQr) {
    setStatus(status, `<strong>${esc(t("failed", { msg: "Native Android bridge tidak tersedia." }))}</strong>`, "error");
    return;
  }
  btn.disabled = true;
  setStatus(status, `${spinner}<span>${esc(t("wifi-scanning"))}</span>`);
  const callbackId = "wifi_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  window.__skarpWifiQrCallbacks = window.__skarpWifiQrCallbacks || {};
  window.__skarpWifiQrCallbacks[callbackId] = (raw) => {
    delete window.__skarpWifiQrCallbacks[callbackId];
    btn.disabled = false;
    hideEl(status);
    const data = parseNativeWifiResult(raw);
    renderWifiResult(data, result);
    showEl(result);
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  try {
    bridge.scanWifiQr(callbackId);
  } catch (e) {
    delete window.__skarpWifiQrCallbacks[callbackId];
    btn.disabled = false;
    setStatus(status, errorHtml(e), "error");
  }
}

/* ---------------- Mobile hotspot helper ---------------- */
const hotspotPage = `
<section class="tool-sub-page hidden" id="tool-hotspot">
  ${subHeader("Mobile Hotspot")}
  <p class="tool-hint" data-tt="hotspot-hint"></p>
  <div class="tool-card-static">
    <div class="wifi-result-head">
      <div class="wifi-result-icon">${ic(ICON.wifi, 28)}</div>
      <div><h4>Mobile Hotspot</h4><span>Android Network Settings</span></div>
    </div>
    <p class="tool-hint" data-tt="hotspot-note"></p>
    <button type="button" class="tool-btn" id="hotspotOpenBtn" data-tt="hotspot-open"></button>
    <button type="button" class="tool-btn-sec" id="hotspotWifiBtn" data-tt="hotspot-wifi"></button>
    <div class="tool-status hidden" id="hotspotStatus"></div>
  </div>
</section>`;

function openNetworkSettings(method) {
  const status = $("hotspotStatus");
  const bridge = getNativeBridge();
  try {
    if (bridge && typeof bridge[method] === "function" && bridge[method]()) {
      if (status) setStatus(status, `<span>${esc(t("hotspot-note"))}</span>`, "success");
      return;
    }
    if (status) setStatus(status, `<strong>${esc(t("failed", { msg: "Pengaturan jaringan tidak dapat dibuka." }))}</strong>`, "error");
  } catch (e) {
    if (status) setStatus(status, errorHtml(e), "error");
  }
}

/* ---------------- navigation inside the tools tab ---------------- */
let activeTool = null;

function openTool(id) {
  activeTool = id;
  hideEl($("toolsMenu"));
  root.querySelectorAll(".tool-sub-page").forEach((p) => p.classList.toggle("hidden", p.id !== "tool-" + id));
  window.scrollTo({ top: 0 });
}

export function closeActiveTool() {
  if (!activeTool) return false;
  if (activeTool === "live-camera") stopLiveCamera();
  activeTool = null;
  root.querySelectorAll(".tool-sub-page").forEach((p) => p.classList.add("hidden"));
  showEl($("toolsMenu"));
  return true;
}

export function resetToolsMenu() {
  if (!root) return;
  closeActiveTool();
  applyLang();
}

/* ---------------- Live Photo-style camera ---------------- */
let liveCameraStream = null;
let liveCameraBusy = false;
function stopLiveCamera() {
  if (liveCameraStream) liveCameraStream.getTracks().forEach((track) => track.stop());
  liveCameraStream = null;
  const video = $("liveCameraPreview");
  if (video) video.srcObject = null;
  ["liveCameraPhoto", "liveCameraLive", "liveCameraStop"].forEach((id) => { if ($(id)) $(id).disabled = true; });
}
function captureCameraFrame() {
  const video = $("liveCameraPreview");
  const canvas = $("liveCameraCanvas");
  if (!video || !canvas || !video.videoWidth) throw new Error("Kamera belum siap");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Gagal membuat foto")), "image/jpeg", 0.94));
}
async function saveCameraBlob(blob, prefix, ext) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return saveToSkarp(bytes, stampName(prefix, ext));
}
async function startLiveCamera() {
  const status = $("liveCameraStatus");
  const start = $("liveCameraStart");
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("Browser tidak menyediakan akses kamera. Pastikan aplikasi berjalan melalui HTTPS atau WebView native.");
    start.disabled = true;
    setStatus(status, esc(t("camera-starting")), "busy");
    liveCameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
    const video = $("liveCameraPreview");
    video.srcObject = liveCameraStream;
    await video.play();
    ["liveCameraPhoto", "liveCameraLive", "liveCameraStop"].forEach((id) => { if ($(id)) $(id).disabled = false; });
    setStatus(status, esc(t("camera-ready")), "success");
  } catch (e) {
    stopLiveCamera();
    start.disabled = false;
    setStatus(status, esc(t("camera-error", { msg: e?.message || String(e) })), "error");
  }
}
async function takeRegularPhoto() {
  if (liveCameraBusy) return;
  const status = $("liveCameraStatus");
  const result = $("liveCameraResult");
  liveCameraBusy = true;
  $("liveCameraPhoto").disabled = $("liveCameraLive").disabled = true;
  try {
    const blob = await captureCameraFrame();
    const saved = await saveCameraBlob(blob, "Photo", "jpg");
    result.classList.remove("hidden");
    result.innerHTML = `<div class="tool-card-static"><img class="live-camera-still" alt="Captured photo" src="${URL.createObjectURL(blob)}"><p>${esc(t("camera-saved-photo", { path: saved.path }))}</p></div>`;
    setStatus(status, esc(t("camera-saved-photo", { path: saved.path })), "success");
  } catch (e) { setStatus(status, esc(t("camera-error", { msg: e?.message || String(e) })), "error"); }
  finally { liveCameraBusy = false; if (liveCameraStream) $("liveCameraPhoto").disabled = $("liveCameraLive").disabled = false; }
}
async function takeMotionPhoto() {
  if (liveCameraBusy) return;
  const status = $("liveCameraStatus");
  const result = $("liveCameraResult");
  if (!liveCameraStream || !liveCameraStream.getVideoTracks().some((track) => track.readyState === "live")) {
    setStatus(status, esc(t("camera-error", { msg: "Kamera belum aktif. Tekan Mulai Kamera lalu izinkan akses kamera." })), "error");
    return;
  }
  if (!window.MediaRecorder) {
    setStatus(status, esc(t("camera-no-mediarecorder")), "error");
    return;
  }
  liveCameraBusy = true;
  $("liveCameraPhoto").disabled = $("liveCameraLive").disabled = true;
  let recorder = null;
  let recordingStream = liveCameraStream;
  let canvasStream = null;
  let drawFrame = null;
  try {
    // Android WebView generally supports WebM more consistently than MP4 MediaRecorder.
    const candidates = ["video/webm;codecs=vp8", "video/webm;codecs=vp9", "video/webm", "video/mp4;codecs=avc1.42E01E", "video/mp4"];
    const mime = candidates.find((type) => {
      try { return typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(type); }
      catch (_) { return false; }
    }) || "";
    const chunks = [];
    try {
      recorder = new MediaRecorder(recordingStream, mime ? { mimeType: mime } : undefined);
    } catch (directError) {
      // Fallback for WebViews that expose the camera but cannot record its original stream.
      const preview = $("liveCameraPreview");
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(640, preview.videoWidth || 1280);
      canvas.height = Math.max(360, preview.videoHeight || 720);
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx || typeof canvas.captureStream !== "function") throw directError;
      canvasStream = canvas.captureStream(24);
      const paint = () => {
        if (!canvasStream || !preview || !preview.videoWidth) return;
        ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
        drawFrame = requestAnimationFrame(paint);
      };
      paint();
      recordingStream = canvasStream;
      recorder = new MediaRecorder(recordingStream, mime ? { mimeType: mime } : undefined);
    }
    const recorded = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => { if (event.data && event.data.size > 0) chunks.push(event.data); };
      recorder.onerror = (event) => {
        const detail = event?.error?.message || event?.message || "WebView tidak dapat merekam stream kamera";
        reject(new Error("Perekaman video gagal: " + detail));
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || mime || "video/webm" });
        if (blob.size < 1024) reject(new Error("Video kosong. Coba mulai ulang kamera atau gunakan mode Foto biasa."));
        else resolve(blob);
      };
    });
    setStatus(status, esc(t("camera-live-working")), "busy");
    recorder.start(250);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const photoBlob = await captureCameraFrame();
    await new Promise((resolve) => setTimeout(resolve, 1400));
    if (recorder.state !== "inactive") recorder.stop();
    const videoBlob = await recorded;
    const photo = await saveCameraBlob(photoBlob, "LivePhoto", "jpg");
    const ext = (videoBlob.type || recorder.mimeType || "video/webm").toLowerCase().includes("mp4") ? "mp4" : "webm";
    const video = await saveCameraBlob(videoBlob, "LivePhotoMotion", ext);
    result.classList.remove("hidden");
    result.innerHTML = `<div class="tool-card-static"><img class="live-camera-still" alt="Motion photo" src="${URL.createObjectURL(photoBlob)}"><video class="live-camera-result-video" controls playsinline src="${URL.createObjectURL(videoBlob)}"></video><p>${esc(t("camera-saved-live", { photo: photo.path, video: video.path }))}</p><p class="tool-hint">${esc(t("live-camera-hint"))}</p></div>`;
    setStatus(status, esc(t("camera-saved-live", { photo: photo.path, video: video.path })), "success");
  } catch (e) {
    if (recorder && recorder.state && recorder.state !== "inactive") { try { recorder.stop(); } catch (_) {} }
    const message = e?.message || String(e);
    setStatus(status, esc(t("camera-error", { msg: message })), "error");
  } finally {
    if (drawFrame !== null) cancelAnimationFrame(drawFrame);
    if (canvasStream) canvasStream.getTracks().forEach((track) => track.stop());
    liveCameraBusy = false;
    if (liveCameraStream) $("liveCameraPhoto").disabled = $("liveCameraLive").disabled = false;
  }
}

export function initTools() {
  root = $("toolsPage");
  if (!root || root.dataset.ready) return;
  root.dataset.ready = "1";
  root.innerHTML = buildPage();
  applyLang();

  root.addEventListener("click", (e) => {
    const card = e.target.closest(".tool-card");
    if (card) return openTool(card.dataset.tool);
    if (e.target.closest("[data-tool-back]")) closeActiveTool();
  });
  root.addEventListener("keydown", (e) => {
    const card = e.target.closest?.(".tool-card");
    if (card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openTool(card.dataset.tool);
    }
  });

  mountFileTool({
    id: "upscale",
    kind: "image",
    getOption: bindSeg($("upScale")),
    run: (file, scale, onStep) => upscaleImage(file, Number(scale) || 2, onStep),
    prefix: "Upscale",
    renderResult: (ctx) => renderImageResult({ ...ctx, label: t("hd"), checker: false }),
  });

  mountFileTool({
    id: "bg",
    kind: "image",
    run: (file, _o, onStep) => removeBackground(file, onStep),
    prefix: "RemoveBG",
    renderResult: (ctx) => renderImageResult({ ...ctx, label: t("result"), checker: true }),
  });

  mountFileTool({
    id: "pdf",
    kind: "pdf",
    getOption: bindSeg($("pdfLevel")),
    run: (file, level, onStep) => compressPdf(file, level || "recommended", onStep),
    prefix: "Compressed",
    renderResult: async ({ file, out, result }) => {
      const before = file.size;
      const after = out.bytes.length;
      if (after >= before) {
        result.innerHTML = `<div class="tool-status error"><strong>${esc(t("no-gain"))}</strong></div>`;
        return;
      }
      const pct = Math.round((1 - after / before) * 100);
      result.innerHTML = `
        <div class="tool-card-static pdf-sum">
          <div class="pdf-sizes"><div><b>${esc(formatBytes(before))}</b><span>${esc(t("original"))}</span></div><div class="pdf-arrow">→</div><div><b>${esc(formatBytes(after))}</b><span>${esc(t("result"))}</span></div></div>
          <div class="pdf-pct">${esc(t("saved-pct", { pct }))}</div>
          <div class="pdf-saved"></div>
        </div>`;
      const box = result.querySelector(".pdf-saved");
      const doSave = async () => {
        try {
          const { saved } = await saveAndReport(out.bytes, "Compressed", out.ext);
          box.innerHTML = savedLine(saved);
          showToast(saved.native ? t("saved-to", { path: saved.path }) : t("saved-browser", { path: saved.path }));
          return saved;
        } catch (e) {
          box.innerHTML = `<div class="tool-status error"><strong>${esc(t("failed", { msg: e.message || e }))}</strong></div>`;
          return null;
        }
      };
      const saved = await doSave();
      result.querySelector(".tool-card-static").appendChild(footerButtons(!!saved?.native, doSave));
    },
  });

  mountAm();

  $("waStoryRun")?.addEventListener("click", scanWhatsAppStories);
  $("wifiQrRun")?.addEventListener("click", scanWifiQr);
  $("hotspotOpenBtn")?.addEventListener("click", () => openNetworkSettings("openMobileHotspotSettings"));
  $("hotspotWifiBtn")?.addEventListener("click", () => openNetworkSettings("openWifiSettings"));
  $("liveCameraStart")?.addEventListener("click", startLiveCamera);
  $("liveCameraPhoto")?.addEventListener("click", takeRegularPhoto);
  $("liveCameraLive")?.addEventListener("click", takeMotionPhoto);
  $("liveCameraStop")?.addEventListener("click", stopLiveCamera);
}

export { clearAmCache, SAVE_DIR };
