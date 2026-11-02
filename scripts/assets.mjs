import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as si from "simple-icons";
import opentype from "opentype.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const symDir = join(root, "node_modules/@material-symbols/svg-400/rounded");
const src = join(root, "src/render");
const pub = join(root, "public");
mkdirSync(pub, { recursive: true });

// Fonts
const fonts = {
  FONT: readFileSync(join(root, "fonts/GeistMono.ttf")).toString("base64"),
  FONT_CYR: readFileSync(join(root, "fonts/MatrixSans.ttf")).toString("base64"),
  FONT_SERIF: readFileSync(join(root, "fonts/Oranienbaum.ttf")).toString("base64"),
};
writeFileSync(
  join(src, "fontdata.ts"),
  Object.entries(fonts).map(([k, v]) => `export const ${k} = "${v}";`).join("\n") + "\n",
);
for (const name of ["GeistMono", "MatrixSans", "Oranienbaum"]) copyFileSync(join(root, `fonts/${name}.ttf`), join(pub, `${name}.ttf`));

// Conservative metrics across all three bundled faces prevent clipping on style changes.
const faces = ["GeistMono", "MatrixSans", "Oranienbaum"].map(name => opentype.parse(readFileSync(join(root, "fonts/" + name + ".ttf")).buffer));
const widths = {};
for (let cp=32; cp<1280; cp++) {const ch=String.fromCodePoint(cp); widths[ch]=Math.max(...faces.map(f => f.getAdvanceWidth(ch, 1)));}
writeFileSync(join(src, "metrics.json"), JSON.stringify({400:widths,500:widths,600:widths,700:widths}));
// Symbols
const symbols = {};
for (const f of readdirSync(symDir)) {
  if (!f.endsWith(".svg")) continue;
  const svg = readFileSync(join(symDir, f), "utf8");
  const ds = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
  const name = f.endsWith("-fill.svg") ? f.slice(0, -9) + "#fill" : f.slice(0, -4);
  symbols[name] = ds.join(" ");
}
writeFileSync(join(pub, "symbols.json"), JSON.stringify(symbols));

// Brands
const brands = {};
for (const icon of Object.values(si)) {
  if (icon && icon.slug && icon.path) brands[icon.slug] = { t: icon.title, d: icon.path, c: icon.hex };
}
writeFileSync(join(pub, "brands.json"), JSON.stringify(brands));

// Core
const coreSymbols = [
  "folder_zip", "monitoring", "music_note", "mic", "desktop_windows", "code", "language", "star",
  "fork_right", "commit", "group", "merge", "book_2", "terminal", "sports_esports", "widgets",
  "palette", "bolt", "arrow_outward", "favorite", "schedule", "download", "person", "location_on",
  "calendar_month", "deployed_code", "school", "work", "mail", "rocket_launch", "brush", "public",
  "pets", "coffee", "headphones", "photo_camera", "add", "link", "cloud", "database",
  "translate", "home", "lightbulb", "verified", "psychology", "dark_mode", "light_mode", "drag_indicator", "edit", "visibility_off", "visibility", "close", "delete", "search", "check", "restart_alt", "image", "open_in_new", "upload", "keyboard_arrow_down", "chevron_right", "shuffle", "arrow_back", "contrast", "local_fire_department", "trophy", "share", "content_copy", "wallpaper", "dashboard", "add_photo_alternate", "arrow_forward", "edit_square", "auto_awesome_mosaic", "info", "format_paint", "account_circle", "shapes", "interests", "animation", "folder_open", "progress_activity",
];
const coreBrands = [
  "rust", "dotnet", "python", "typescript", "javascript", "nextdotjs", "openjdk", "hyprland",
  "archlinux", "discord", "git", "githubactions", "react", "nodedotjs", "tauri", "electron", "github",
  "telegram", "vuedotjs", "svelte", "tailwindcss", "figma", "docker", "linux", "go", "kotlin",
  "swift", "cplusplus", "html5", "css", "vite", "postgresql", "android", "flutter", "dart", "php",
  "x", "youtube", "twitch", "spotify", "vercel", "supabase", "unity", "godotengine", "blender", "instagram", "tiktok", "vk", "bluesky", "mastodon", "reddit", "steam", "boosty", "patreon", "kofi", "buymeacoffee", "devdotto", "medium", "habr", "leetcode", "codepen", "dribbble", "behance", "threads", "pinterest", "whatsapp", "signal", "gmail", "protonmail", "linktree", "itchdotio", "artstation", "soundcloud", "yandexcloud",
];
const core = { symbol: {}, brand: {} };
for (const n of coreSymbols) {
  if (symbols[n]) core.symbol[n] = symbols[n];
  else console.warn("no symbol", n);
  if (symbols[n + "#fill"]) core.symbol[n + "#fill"] = symbols[n + "#fill"];
}
for (const n of coreBrands) if (brands[n]) core.brand[n] = brands[n]; else console.warn("no brand", n);
writeFileSync(join(src, "core-icons.json"), JSON.stringify(core));

console.log("symbols", Object.keys(symbols).length, "brands", Object.keys(brands).length);

