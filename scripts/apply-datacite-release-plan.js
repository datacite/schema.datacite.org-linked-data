#!/usr/bin/env node

const path = require("path");
const { compareVersions, getArgValue, listManifestVersions } = require("./lib/versioning");
const { moduleById, modules } = require("./lib/release-import/modules");
const { buildReleaseMatrix, writeReleaseMatrix } = require("./lib/release-import/apply-utils");
const { planToMarkdown } = require("./lib/release-import/plan");
const { readJson, runNodeScript, writeText, die, unique } = require("./lib/release-import/shared");

const repoRoot = process.cwd();

function parseModulesArg(value) {
  if (!value) {
    return new Set(modules.map((entry) => entry.moduleId));
  }

  return new Set(
    String(value)
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
}

function buildApplyReport(plan, appliedChangeIds, enabledModules) {
  const lines = [
    `# DataCite Release Apply Result: ${plan.targetVersion}`,
    "",
    "## Summary",
    `- Plan file: reports/release-import-plan-${plan.targetVersion}.json`,
    `- Enabled modules: ${Array.from(enabledModules).join(", ") || "none"}`,
    `- Applied changes: ${appliedChangeIds.length}`,
    "",
    "## Applied Change IDs",
  ];

  if (appliedChangeIds.length) {
    for (const changeId of appliedChangeIds) {
      lines.push(`- ${changeId}`);
    }
  } else {
    lines.push("- None.");
  }

  const pending = plan.changes.filter((change) => change.status !== "apply");
  lines.push("", "## Pending / Untouched Change IDs");
  if (pending.length) {
    for (const change of pending) {
      lines.push(`- ${change.id} (${change.status})`);
    }
  } else {
    lines.push("- None.");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const argv = process.argv.slice(2);
  const wantsHelp = argv.includes("-h") || argv.includes("--help");
  const planArg = getArgValue(argv, "--plan");
  const modulesArg = getArgValue(argv, "--modules");
  const shouldSetCurrent = argv.includes("--set-current");

  if (wantsHelp) {
    console.log(
      [
        "Usage: node scripts/apply-datacite-release-plan.js --plan reports/release-import-plan-<version>.json [--modules <csv>] [--set-current]",
        "",
        "  --plan <path>      Required path to the approved release import plan JSON",
        "  --modules <csv>    Optional comma-separated module ids to enable for this run",
        "  --set-current      Also update datacite-current pointers when generating outputs",
      ].join("\n"),
    );
    process.exit(0);
  }

  if (!planArg) {
    die("Missing required argument: --plan <path>");
  }

  const planPath = path.isAbsolute(planArg) ? planArg : path.join(repoRoot, planArg);
  const plan = readJson(planPath);
  const planReportPath = path.join(path.dirname(planPath), `${path.basename(planPath, ".json")}.md`);
  const enabledModules = parseModulesArg(modulesArg);
  const previousVersion = listManifestVersions(repoRoot)
    .filter((version) => compareVersions(version, plan.targetVersion) < 0)
    .pop();

  if (!previousVersion) {
    die(`Could not determine previous local version for target ${plan.targetVersion}`);
  }

  const namespace = readJson(path.join(repoRoot, "manifest", `datacite-${previousVersion}.json`)).namespace;
  const context = {
    appliedChangeIds: [],
    changedFiles: [],
    namespace,
    releaseMatrixChanges: [],
    repoRoot,
  };

  for (const change of plan.changes || []) {
    if (change.status !== "apply") {
      continue;
    }
    if (!enabledModules.has(change.module)) {
      continue;
    }

    const module = moduleById(change.module);
    if (!module) {
      throw new Error(`No module registered for ${change.module}`);
    }
    if (!module.supportedKinds.includes(change.kind)) {
      throw new Error(`Module ${change.module} does not support change kind ${change.kind}`);
    }

    module.validate(change, context);
    if (!module.canApply(change, context)) {
      throw new Error(`Module ${change.module} cannot apply change ${change.id}`);
    }
    module.apply(change, context);
  }

  const sources = unique([
    ...(plan.sources || []),
    ...((plan.changes || [])
      .filter((change) => context.appliedChangeIds.includes(change.id))
      .flatMap((change) => change.evidence || [])),
  ]);

  if (context.releaseMatrixChanges.length) {
    writeReleaseMatrix(
      repoRoot,
      previousVersion,
      plan.targetVersion,
      plan.releaseDate,
      context.releaseMatrixChanges,
      sources,
      context.changedFiles,
    );
  } else if (context.appliedChangeIds.length) {
    const matrixPath = path.join(repoRoot, "manifest", `release-matrix-${previousVersion}-${plan.targetVersion}.json`);
    const currentMatrix = readJson(matrixPath);
    const nextMatrix = buildReleaseMatrix(previousVersion, plan.targetVersion, plan.releaseDate, currentMatrix.changes || [], sources);
    require("./lib/release-import/apply-utils").writeJsonIfChanged(matrixPath, nextMatrix, context.changedFiles);
  }

  if (context.appliedChangeIds.length) {
    const snapshotArgs = ["--version", plan.targetVersion, "--release-date", plan.releaseDate];
    if (!shouldSetCurrent) {
      snapshotArgs.push("--no-set-current");
    }
    runNodeScript(repoRoot, "scripts/release-snapshot.js", snapshotArgs);
  }

  writeText(planReportPath, planToMarkdown(plan));
  const reportPath = path.join(repoRoot, "reports", `release-apply-${plan.targetVersion}.md`);
  writeText(reportPath, buildApplyReport(plan, context.appliedChangeIds, enabledModules));

  console.log(`Applied ${context.appliedChangeIds.length} change(s).`);
  console.log(`Refreshed ${path.relative(repoRoot, planReportPath)}`);
  console.log(`Wrote ${path.relative(repoRoot, reportPath)}`);
}

main().catch((err) => {
  die(err && err.stack ? err.stack : String(err));
});
