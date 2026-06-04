#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name) {
  const index = args.indexOf(name);
  if (index === -1 || !args[index + 1]) {
    throw new Error(`Missing required argument: ${name}`);
  }
  return path.resolve(args[index + 1]);
}

function assertFile(filePath, label) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`${label} not found: ${filePath}`);
  }
}

function assertDir(dirPath, label) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(`${label} not found: ${dirPath}`);
  }
}

function copyDirContents(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });
  }
}

const studioDir = readArg("--studio");
const veilpixDir = readArg("--veilpix");
const veilchatDir = readArg("--veilchat");
const outputDir = readArg("--out");

assertFile(path.join(studioDir, "index.html"), "VeilStudio build output");
assertFile(path.join(veilpixDir, "index.html"), "VeilPix build output");
assertFile(path.join(veilchatDir, "index.html"), "VeilChat static entry");

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

copyDirContents(studioDir, outputDir);

const veilpixTarget = path.join(outputDir, "veilpix");
copyDirContents(veilpixDir, veilpixTarget);
fs.rmSync(path.join(veilpixTarget, ".htaccess"), { force: true });

const veilchatTarget = path.join(outputDir, "veilchat");
copyDirContents(veilchatDir, veilchatTarget);
fs.rmSync(path.join(veilchatTarget, "server"), { recursive: true, force: true });

const serviceWorkerPath = path.join(veilchatTarget, "service-worker.js");
if (fs.existsSync(serviceWorkerPath)) {
  const buildTime = Math.floor(Date.now() / 1000).toString();
  const serviceWorker = fs.readFileSync(serviceWorkerPath, "utf8");
  fs.writeFileSync(
    serviceWorkerPath,
    serviceWorker.replace(
      /const CACHE_VERSION = Date\.now\(\);/,
      `const CACHE_VERSION = '${buildTime}';`
    )
  );
}

fs.writeFileSync(
  path.join(outputDir, "_redirects"),
  [
    "/veilpix/payment/success* /veilpix/index.html 200",
    "/veilpix/payment/cancelled* /veilpix/index.html 200",
    "/veilpix/sso-callback* /veilpix/index.html 200",
    "",
  ].join("\n")
);

assertDir(path.join(outputDir, "_next"), "VeilStudio static assets");
assertFile(path.join(outputDir, "veilpix", "index.html"), "VeilPix deployed entry");
assertFile(path.join(outputDir, "veilchat", "index.html"), "VeilChat deployed entry");

console.log(`Cloudflare Pages artifact assembled at ${outputDir}`);
