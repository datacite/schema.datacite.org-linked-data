#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { compareVersions } = require("./lib/versioning");

const repoRoot = process.cwd();
const indexPath = path.join(repoRoot, "index.html");
const currentManifestPath = path.join(repoRoot, "manifest", "datacite-current.json");

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

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch (err) {
    die(`Failed to read text: ${file}\n${err.message}`);
  }
}

function writeText(file, value) {
  fs.writeFileSync(file, value);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function versionLink(version) {
  return {
    manifest: `/linked-data/manifest/datacite-${version}.json`,
    dist: `/linked-data/dist/datacite-${version}.jsonld`,
  };
}

function orderedVersions(pointer) {
  const currentVersion = String(pointer.currentVersion || "");
  const versions = Array.isArray(pointer.availableVersions) ? pointer.availableVersions : [];
  const unique = Array.from(new Set(versions.map((entry) => String(entry.version || "")).filter(Boolean)));
  unique.sort((a, b) => compareVersions(b, a));

  if (currentVersion && !unique.includes(currentVersion)) {
    unique.unshift(currentVersion);
  }

  return currentVersion
    ? [currentVersion, ...unique.filter((version) => version !== currentVersion)]
    : unique;
}

function replaceAutoBlock(html, name, content, indent) {
  const start = `<!-- AUTO ${name}:start -->`;
  const end = `<!-- AUTO ${name}:end -->`;
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);
  if (!pattern.test(html)) {
    die(`Auto-update markers not found for block: ${name}`);
  }

  return html.replace(pattern, `${start}\n${content}\n${indent}${end}`);
}

function buildCurrentMeta(currentVersion) {
  return [
    '          <span class="chip">Audience: Developers, metadata engineers, tool builders</span>',
    `          <span class="chip">Current staged version: DataCite ${currentVersion}</span>`,
    '          <span class="chip">Single-file import: <a href="/linked-data/dist/datacite-current.jsonld">current pointer</a></span>',
    '          <span class="chip">Machine entry point: <a href="/linked-data/manifest/datacite-current.json">current manifest pointer</a></span>',
  ].join("\n");
}

function buildStartLinks(currentVersion, versions) {
  const currentLinks = versionLink(currentVersion);
  const quickLinks = versions
    .map((version) => {
      const links = versionLink(version);
      return `            <p><a href="${links.manifest}">${version} manifest</a> · <a href="${links.dist}">${version} bundle</a></p>`;
    })
    .join("\n");

  return [
    '          <article class="card span-6">',
    `            <h3>I need a single importable bundle (v${currentVersion})</h3>`,
    "            <p>Open the integrated distribution if you want one file with classes, properties, vocabularies, and metadata together.</p>",
    `            <a href="${currentLinks.dist}">Open v${currentVersion} bundle</a>`,
    `            <div class="path"><code>${currentLinks.dist}</code></div>`,
    "          </article>",
    '          <article class="card span-6">',
    `            <h3>I need a machine-readable index of everything (v${currentVersion})</h3>`,
    "            <p>Open the manifest to discover classes, properties, vocabulary schemes, and terms.</p>",
    `            <a href="${currentLinks.manifest}">Open v${currentVersion} manifest</a>`,
    `            <div class="path"><code>${currentLinks.manifest}</code></div>`,
    "          </article>",
    '          <article class="card span-12">',
    "            <h3>Version Quick Links</h3>",
    "            <p>Use current pointers for default behavior, or open a frozen version directly.</p>",
    '            <p><a href="/linked-data/manifest/datacite-current.json">Current manifest pointer</a> · <a href="/linked-data/dist/datacite-current.jsonld">Current distribution pointer</a></p>',
    quickLinks,
    "          </article>",
  ].join("\n");
}

function buildVersionList(currentVersion, versions) {
  return versions
    .map((version, index) => {
      const links = versionLink(version);
      if (version === currentVersion) {
        return [
          `            <p><strong>DataCite ${version}</strong> (current staged set)</p>`,
          `            <p class="muted">`,
          `              This staged namespace currently exposes a DataCite ${version} linked-data set with JSON-LD class, property,`,
          "              vocabulary, context, manifest, and distribution resources.",
          "            </p>",
          `            <p><a href="${links.manifest}">Open the DataCite ${version} manifest</a></p>`,
          `            <p><a href="${links.dist}">Open the DataCite ${version} bundle</a></p>`,
        ].join("\n");
      }

      const label = index === 1 ? "frozen previous version" : "frozen version";
      return [
        `            <p><strong>DataCite ${version}</strong> (${label})</p>`,
        "            <p class=\"muted\">",
        `              DataCite ${version} remains available as a versioned snapshot for compatibility and historical reference.`,
        "            </p>",
        `            <p><a href="${links.manifest}">Open the DataCite ${version} manifest</a></p>`,
        `            <p><a href="${links.dist}">Open the DataCite ${version} bundle</a></p>`,
      ].join("\n");
    })
    .join("\n");
}

function main() {
  const pointer = readJson(currentManifestPath);
  const currentVersion = String(pointer.currentVersion || "");

  if (!currentVersion) {
    die(`currentVersion missing in ${path.relative(repoRoot, currentManifestPath)}`);
  }

  const versions = orderedVersions(pointer);
  const original = readText(indexPath);
  let next = original;

  next = replaceAutoBlock(next, "current-meta", buildCurrentMeta(currentVersion), "          ");
  next = replaceAutoBlock(next, "start-links", buildStartLinks(currentVersion, versions), "          ");
  next = replaceAutoBlock(next, "versions-list", buildVersionList(currentVersion, versions), "            ");

  if (next !== original) {
    writeText(indexPath, next);
    console.log(`Wrote ${path.relative(repoRoot, indexPath)}`);
  } else {
    console.log(`No changes needed for ${path.relative(repoRoot, indexPath)}`);
  }
}

main();
