#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { compareVersions, getArgValue, listManifestVersions } = require("./lib/versioning");

const repoRoot = process.cwd();

function die(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    die(`Failed to read JSON: ${file}\n${err.message}`);
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function runNodeScript(scriptRelPath, args) {
  const scriptAbsPath = path.join(repoRoot, scriptRelPath);
  const result = spawnSync(process.execPath, [scriptAbsPath, ...args], {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if (result.error) {
    die(`Failed to run ${scriptRelPath}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    die(`${scriptRelPath} exited with status ${result.status}`);
  }
}

function ensureManifestExists(version, releaseDate, allowReleaseDateUpdate = false) {
  const targetPath = path.join(repoRoot, "manifest", `datacite-${version}.json`);
  if (fs.existsSync(targetPath)) {
    const json = readJson(targetPath);
    if (!json.releaseDate) {
      json.releaseDate = releaseDate;
      writeJson(targetPath, json);
      console.log(`Updated releaseDate in manifest/datacite-${version}.json`);
    } else if (allowReleaseDateUpdate && json.releaseDate !== releaseDate) {
      json.releaseDate = releaseDate;
      writeJson(targetPath, json);
      console.log(`Corrected releaseDate in manifest/datacite-${version}.json`);
    }
    return;
  }

  const candidates = listManifestVersions(repoRoot)
    .filter((v) => v !== version)
    .sort(compareVersions);
  const baseVersion = candidates.length ? candidates[candidates.length - 1] : null;

  if (!baseVersion) {
    die(`Cannot create manifest/datacite-${version}.json: no existing versioned manifest found.`);
  }

  const basePath = path.join(repoRoot, "manifest", `datacite-${baseVersion}.json`);
  const baseManifest = readJson(basePath);
  const nextManifest = {
    ...baseManifest,
    version,
    releaseDate,
  };

  writeJson(targetPath, nextManifest);
  console.log(`Created manifest/datacite-${version}.json from datacite-${baseVersion}.json`);
}

function main() {
  const argv = process.argv.slice(2);
  const wantsHelp = argv.includes("-h") || argv.includes("--help");
  const version = getArgValue(argv, "--version");
  const requestedReleaseDate = getArgValue(argv, "--release-date");
  const releaseDate = requestedReleaseDate || new Date().toISOString().slice(0, 10);
  const shouldSetCurrent = !argv.includes("--no-set-current");

  if (wantsHelp) {
    console.log(
      [
        "Usage: node scripts/release-snapshot.js --version <x.y> [--release-date YYYY-MM-DD] [--no-set-current]",
        "",
        "  --version <x.y>             Target DataCite schema version for manifest/dist outputs",
        "  --release-date YYYY-MM-DD   Stable release date for manifest/dist metadata (default: today)",
        "  --no-set-current            Build artifacts without updating datacite-current pointers",
      ].join("\n"),
    );
    process.exit(0);
  }

  if (!version) {
    die("Missing required argument: --version <x.y>");
  }

  ensureManifestExists(version, releaseDate, Boolean(requestedReleaseDate));

  runNodeScript("scripts/manifest-sync.js", ["--write", "--validate", "--version", version]);
  runNodeScript("scripts/build-distribution.js", ["--version", version]);

  if (shouldSetCurrent) {
    runNodeScript("scripts/update-current-pointers.js", ["--version", version]);
  }

  runNodeScript("scripts/generate-index-pages.js", []);
}

main();
