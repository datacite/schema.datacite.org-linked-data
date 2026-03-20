#!/usr/bin/env node

const path = require("path");
const { getArgValue } = require("./lib/versioning");
const { createEvidenceLoader } = require("./lib/release-import/evidence");
const { detectReleaseChanges } = require("./lib/release-import/detectors");
const { createPlan, planToMarkdown, writePlanArtifacts } = require("./lib/release-import/plan");
const { releaseHistoryUrl, resolveTargetRelease } = require("./lib/release-import/release-history");
const { die } = require("./lib/release-import/shared");

const repoRoot = process.cwd();

async function main() {
  const argv = process.argv.slice(2);
  const wantsHelp = argv.includes("-h") || argv.includes("--help");
  const requestedVersion = getArgValue(argv, "--version");
  const requestedReleaseDate = getArgValue(argv, "--release-date");

  if (wantsHelp) {
    console.log(
      [
        "Usage: node scripts/detect-datacite-release.js [--version <x.y>] [--release-date YYYY-MM-DD]",
        "",
        "  --version <x.y>             Optional explicit target version. If omitted, detect the next official DataCite 4.x release.",
        "  --release-date YYYY-MM-DD   Optional explicit release date. If omitted, use the official release date from versions.html.",
      ].join("\n"),
    );
    process.exit(0);
  }

  const releaseResolution = await resolveTargetRelease(repoRoot, requestedVersion, requestedReleaseDate);
  const missingLocalVersions = releaseResolution.officialVersions.filter(
    (officialVersion) => !releaseResolution.localVersions.includes(officialVersion),
  );

  if (releaseResolution.noNewerRelease && !requestedVersion) {
    const plan = createPlan(
      {
        localLatestVersion: releaseResolution.localLatestVersion,
        notes: [
          `No newer official DataCite 4.x release was found after local version ${releaseResolution.localLatestVersion || "none"}.`,
          missingLocalVersions.length
            ? `Official 4.x versions missing locally: ${missingLocalVersions.join(", ")}`
            : "No official 4.x versions are missing locally.",
        ],
        officialLatestVersion: releaseResolution.officialLatest.version,
        releaseDate: releaseResolution.releaseDate,
        sources: [releaseHistoryUrl],
        targetVersion: releaseResolution.targetVersion,
      },
      [],
    );

    const markdown = planToMarkdown(plan, {
      missingLocalVersions,
      noNewerRelease: true,
    });
    const artifactPaths = writePlanArtifacts(repoRoot, releaseResolution.targetVersion, plan, markdown);

    console.log(`No newer official DataCite 4.x release detected after local version ${releaseResolution.localLatestVersion || "none"}.`);
    console.log(`Wrote ${path.relative(repoRoot, artifactPaths.planPath)}`);
    console.log(`Wrote ${path.relative(repoRoot, artifactPaths.reportPath)}`);
    return;
  }

  const previousVersion = releaseResolution.localVersions
    .filter((version) => version && version !== releaseResolution.targetVersion)
    .filter((version) => require("./lib/versioning").compareVersions(version, releaseResolution.targetVersion) < 0)
    .pop();

  if (!previousVersion) {
    die(`Could not determine a previous local manifest version for target ${releaseResolution.targetVersion}`);
  }

  const evidenceLoader = createEvidenceLoader(releaseResolution.targetVersion);
  const detection = await detectReleaseChanges(repoRoot, releaseResolution.targetVersion, previousVersion, evidenceLoader);

  const plan = createPlan(
    {
      localLatestVersion: releaseResolution.localLatestVersion,
      notes: [
        `Detected against previous local version ${previousVersion}.`,
        missingLocalVersions.length
          ? `Official 4.x versions missing locally: ${missingLocalVersions.join(", ")}`
          : "No official 4.x versions are missing locally.",
      ],
      officialLatestVersion: releaseResolution.officialLatest.version,
      releaseDate: releaseResolution.releaseDate,
      sources: [releaseHistoryUrl, ...detection.sources],
      targetVersion: releaseResolution.targetVersion,
    },
    detection.changes,
  );

  const markdown = planToMarkdown(plan, {
    missingLocalVersions,
    noNewerRelease: false,
  });
  const artifactPaths = writePlanArtifacts(repoRoot, releaseResolution.targetVersion, plan, markdown);

  console.log(`Wrote ${path.relative(repoRoot, artifactPaths.planPath)}`);
  console.log(`Wrote ${path.relative(repoRoot, artifactPaths.reportPath)}`);
}

main().catch((err) => {
  die(err && err.stack ? err.stack : String(err));
});
