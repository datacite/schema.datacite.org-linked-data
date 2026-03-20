# Beginner Runbook: Handling a New DataCite Release

This guide explains what to do when DataCite publishes a new schema release such as `4.8`.

It is written for someone who is new to:

- Git
- GitHub
- branches
- pull requests
- GitHub Actions
- this repository

The goal is simple:

- detect whether DataCite published a new release
- generate a review plan
- approve only the safe changes
- let automation create and update the repo files
- review the output
- merge to `main`

If you follow this guide, you should be able to manage a new release without someone walking you through it live.

## What Lives in This Repo

These are the folders you need to know:

- `vocab/`: controlled vocabulary schemes and term files such as `resourceTypeGeneral`, `relationType`, and `nameType`
- `property/`: one JSON-LD file per DataCite property
- `class/`: one JSON-LD file per class or object structure
- `context/`: JSON-LD key mappings, especially `context/fullcontext.jsonld`
- `manifest/`: version inventories and release summaries
- `dist/`: generated full distribution files for each released version
- `reports/`: review plans and apply reports created during the release process

Think of it this way:

- `vocab/`, `property/`, `class/`, `context/`, and `manifest/release-matrix-*.json` are the main source files
- `manifest/datacite-*.json`, `dist/`, and the generated `index.html` files are outputs

## The Two Workflows You Use

There are now two separate GitHub Actions workflows for release import:

1. `Detect DataCite Release`
2. `Apply DataCite Release Plan`

Do not confuse them.

### `Detect DataCite Release`

This workflow:

- checks [https://schema.datacite.org/versions.html](https://schema.datacite.org/versions.html)
- finds the next official DataCite `4.x` version after the latest version already in this repo
- reads official docs and XSD files
- writes a machine-readable plan file
- writes a human-readable Markdown review report
- commits both plan files back to the branch by default
- uploads both as an artifact too

This workflow does not change schema source files, but it does create or refresh plan files in `reports/`.

### `Apply DataCite Release Plan`

This workflow:

- reads an approved plan file that already exists in the branch
- runs only the modules you allow
- writes any new source files
- updates the release matrix
- runs the snapshot generator to rebuild outputs
- optionally commits the generated files back to the branch

This workflow does change repo files.

## Important Plain-English Words

- `main`: the official branch
- `branch`: your safe working copy of the repo
- `workflow`: a GitHub Action
- `artifact`: a downloadable zip file produced by a workflow
- `plan`: the JSON file that lists detected release changes and whether each should be applied
- `module`: one family of automation, such as controlled vocabularies or simple properties

## The Normal Release Process

Use this sequence whenever there is a new DataCite release.

1. Create a branch from `main`.
2. Run `Detect DataCite Release` on that branch.
3. Open the generated plan file on that branch under `reports/`.
4. Review the JSON plan and change statuses from `proposed` to `apply`, `skip`, or `manual`.
5. Commit the approved JSON plan to your branch.
6. Run `Apply DataCite Release Plan` on that branch.
7. Review the bot commit and workflow artifact.
8. Open a pull request into `main`.
9. Merge after review.
10. Let the normal deploy workflow publish what was merged to `main`.

## Step-by-Step: GitHub Website Path

This is the safest path for beginners.

### Step 1: Check whether there is a new official release

Open:

- [https://schema.datacite.org/versions.html](https://schema.datacite.org/versions.html)

Look at the newest `4.x` version listed there.

Examples:

- if the newest version on the page is `4.7` and this repo already has `4.7`, there is nothing new to import
- if the newest version on the page is `4.8` and this repo only has `4.7`, you need to prepare a `4.8` upgrade

Important:

- the automation only supports sequential upgrades
- if the repo is on `4.7` and DataCite has `4.9`, you must import `4.8` first

### Step 2: Create a branch from `main`

In GitHub:

1. open the repo
2. switch to the `main` branch
3. create a new branch

Use a branch name like:

- `upgrade-4.8`
- `release-4.8`
- `datacite-4.8-import`

Do not work directly on `main`.

### Step 3: Run `Detect DataCite Release`

In GitHub:

1. click `Actions`
2. click `Detect DataCite Release`
3. click `Run workflow`
4. choose your branch in the branch dropdown

Inputs:

- `version`: leave blank to auto-detect the next release
- `release_date`: leave blank to use the official date from `versions.html`
- `commit_plan_files`: leave this as `true` so the plan files are written back to the branch automatically

When to fill them manually:

- use `version` if you are rebuilding or testing a specific release
- use `release_date` only if you know the official date and need to override it

### Step 4: Read the detection result

When the workflow finishes:

1. open the workflow run
2. read the summary
3. open your branch on GitHub
4. open the committed files under `reports/`

- `reports/release-import-plan-4.8.json`
- `reports/release-import-plan-4.8.md`

The Markdown file is the easiest one to read first, but the JSON file is the one you edit.

### Step 5: Understand the plan file

The JSON plan contains top-level metadata:

- `localLatestVersion`
- `officialLatestVersion`
- `targetVersion`
- `releaseDate`
- `sources`
- `generatedAt`

It also contains `changes`, which is the important list.

Each change has:

- `id`
- `kind`
- `module`
- `section`
- `status`
- `confidence`
- `summary`
- `evidence`
- `inputs`
- `targets`
- `notes`

### Step 6: Understand the status values

- `proposed`: the detector believes this change is supported and safe enough for review, but it will not run until you approve it
- `apply`: you approved this item and want the apply workflow to run it
- `skip`: you intentionally do not want to run this item
- `manual`: this item is ambiguous or unsupported and should not be applied automatically

Important rule:

- nothing should start as `apply`
- you must review and decide
- edit the JSON file only; the Markdown file is generated for review

## Step 6a: JSON Examples for Common Decisions

These examples show how the JSON plan should look when you approve or reject items.

### Example: approve a normal supported item

This is the most common case.

Before:

```json
{
  "id": "controlled-list-values-added:resourceTypeGeneral:4.8",
  "kind": "controlled-list-values-added",
  "module": "controlled-list",
  "section": "resourceTypeGeneral",
  "status": "proposed",
  "confidence": "high",
  "summary": "Add resourceTypeGeneral terms: ExampleType",
  "evidence": [
    "https://schema.datacite.org/versions.html"
  ],
  "inputs": {
    "descriptorId": "resourceTypeGeneral"
  },
  "targets": [
    "vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld",
    "vocab/resourceTypeGeneral/ExampleType.jsonld"
  ],
  "notes": []
}
```

After:

```json
{
  "id": "controlled-list-values-added:resourceTypeGeneral:4.8",
  "kind": "controlled-list-values-added",
  "module": "controlled-list",
  "section": "resourceTypeGeneral",
  "status": "apply",
  "confidence": "high",
  "summary": "Add resourceTypeGeneral terms: ExampleType",
  "evidence": [
    "https://schema.datacite.org/versions.html"
  ],
  "inputs": {
    "descriptorId": "resourceTypeGeneral"
  },
  "targets": [
    "vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld",
    "vocab/resourceTypeGeneral/ExampleType.jsonld"
  ],
  "notes": []
}
```

The only required change there is:

- `"status": "apply"`

### Example: explicitly skip an item

Use this when you reviewed a change and do not want automation to run it.

```json
{
  "id": "simple-property-added:exampleProperty:4.8",
  "kind": "simple-property-added",
  "module": "simple-property",
  "section": "exampleProperty",
  "status": "skip",
  "confidence": "high",
  "summary": "Add simple property exampleProperty",
  "evidence": [],
  "inputs": {},
  "targets": [],
  "notes": [
    "Skipped intentionally pending manual design review."
  ]
}
```

### Example: leave an item as manual

Use this when the detector found something real, but it is not safe to automate yet.

```json
{
  "id": "xsd-element-added:complexThing:4.8",
  "kind": "xsd-element-added",
  "module": "complex-structure",
  "section": "complexThing",
  "status": "manual",
  "confidence": "low",
  "summary": "Review unsupported added schema element complexThing",
  "evidence": [],
  "inputs": {},
  "targets": [],
  "notes": [
    "No matching blueprint exists yet."
  ]
}
```

### Example: rename item with the extra fields filled in

Rename items need more than a status change.

```json
{
  "id": "controlled-list-rename-candidate:relationType:4.8",
  "kind": "controlled-list-rename-candidate",
  "module": "rename",
  "section": "relationType",
  "status": "apply",
  "confidence": "low",
  "summary": "Review rename candidates in relationType",
  "evidence": [],
  "inputs": {
    "descriptorId": "relationType",
    "replacement": "OldValue",
    "renameTo": "NewValue",
    "orderedTerms": [
      "IsCitedBy",
      "Cites",
      "NewValue"
    ],
    "newTermDetails": {
      "prefLabel": "NewValue",
      "definition": "Official DataCite definition here.",
      "scopeNote": "Optional usage note.",
      "example": [
        "<relatedIdentifier relationType=\"NewValue\">10.1234/example</relatedIdentifier>"
      ]
    },
    "preserveHistoricalFile": true,
    "dropReplacedFromScheme": true
  },
  "targets": [],
  "notes": [
    "Approved rename after manual review."
  ]
}
```

### Example: removal item with the extra fields filled in

Removal items also need explicit instructions.

```json
{
  "id": "controlled-list-values-removed:descriptionType:4.8",
  "kind": "controlled-list-values-removed",
  "module": "removal",
  "section": "descriptionType",
  "status": "apply",
  "confidence": "medium",
  "summary": "Review removed descriptionType terms: DeprecatedValue",
  "evidence": [],
  "inputs": {
    "descriptorId": "descriptionType",
    "removedValues": [
      "DeprecatedValue"
    ],
    "preserveHistoricalFile": true,
    "dropRemovedFromScheme": true
  },
  "targets": [],
  "notes": [
    "Approved removal from the new current version only."
  ]
}
```

For non-vocabulary removals where you want the current context cleaned up too:

```json
{
  "id": "element-removed:oldProperty:4.8",
  "kind": "xsd-element-removed",
  "module": "removal",
  "section": "oldProperty",
  "status": "apply",
  "confidence": "medium",
  "summary": "Review removed schema element oldProperty",
  "evidence": [],
  "inputs": {
    "propertyName": "oldProperty",
    "preserveHistoricalFile": true,
    "dropFromCurrentContext": true,
    "contextKeys": [
      "oldProperty"
    ]
  },
  "targets": [],
  "notes": [
    "Remove from the current context only after review."
  ]
}
```

### Step 7: Understand the module names

These are the module families used by the apply workflow:

- `controlled-list`: new vocabulary terms and scheme updates
- `simple-property`: one new property file plus optional context and release-matrix updates
- `property-group`: grouped property additions under an existing area
- `complex-structure`: larger structures such as `RelatedItem` or `FundingReference`
- `rename`: rename or replacement cases that need explicit instructions
- `removal`: removed values or fields that need explicit instructions

## What the Detector Can Usually Handle Safely

These are good candidates for automatic application:

- new controlled vocabulary terms in existing appendix-backed lists
- new simple properties
- some grouped property additions
- some known larger structures if they match an existing blueprint

These are not safe to auto-apply without review:

- removals
- renames
- deprecated terms
- complex structural changes the repo has never seen before
- anything that appears in the plan as `manual`

## Step 8: Open the committed plan file on your branch

This is the main improvement in the new flow.

The detect workflow now commits the plan files back to the branch by default.

That means you can stay in GitHub and edit:

- `reports/release-import-plan-<version>.json`

You do not need to download an artifact, edit it locally, and upload it again.

## Step 9: Review and approve the plan

Open `reports/release-import-plan-<version>.json`.

For each change:

- leave it as `manual` if it needs human work
- change `status` to `apply` if you want automation to run it
- change `status` to `skip` if you do not want it applied

Examples:

- if DataCite added a new `resourceTypeGeneral` value and the plan shows a `controlled-list` item with the correct term names, that is a good `apply` candidate
- if the plan shows a removal or rename and does not have explicit replacement instructions yet, leave it as `manual`

### Extra requirements for rename and removal items

`rename` and `removal` items are intentionally strict.

They only run if the plan includes explicit instructions such as:

- `renameTo`
- `replacement`
- `orderedTerms`
- `newTermDetails`
- `preserveHistoricalFile`
- `dropRemovedFromScheme`
- `dropFromCurrentContext`
- `contextKeys`

If those fields are missing, the module will refuse to run.

## Step 10: Commit the approved JSON plan

After you edit the plan, commit:

- `reports/release-import-plan-<version>.json`

You do not need to hand-edit the Markdown file.

The apply workflow refreshes `reports/release-import-plan-<version>.md` from the JSON plan before it finishes.

## Step 11: Run `Apply DataCite Release Plan`

In GitHub:

1. open `Actions`
2. click `Apply DataCite Release Plan`
3. click `Run workflow`
4. choose the same branch

Fill the inputs like this:

- `plan_path`: `reports/release-import-plan-4.8.json`
- `set_current`: `true` if this new version should become the new current version
- `commit_generated_files`: usually `true`

Module checkboxes:

- turn on only the module families you want to allow in this run
- if your plan only contains controlled-list and simple-property changes, you can leave the others off

Safe default:

- `apply_controlled_lists`: `true`
- `apply_simple_properties`: `true`
- `apply_property_groups`: only if you reviewed those items
- `apply_complex_structures`: only if you reviewed those items
- `apply_renames`: usually `false` unless you explicitly completed the rename instructions
- `apply_removals`: usually `false` unless you explicitly completed the removal instructions

## Step 12: What the apply workflow does

If approved items exist, the workflow will:

1. read the plan from your branch
2. apply only `status: apply` items
3. create or update source files
4. write or refresh `manifest/release-matrix-<from>-<to>.json`
5. run `scripts/release-snapshot.js`
6. regenerate versioned `manifest/` and `dist/` outputs
7. regenerate section index pages and the root `index.html`
8. write `reports/release-apply-<version>.md`
9. commit generated files back to the branch if `commit_generated_files` is `true`
10. upload an artifact of the results
11. refresh `reports/release-import-plan-<version>.md` from the JSON plan

## Step 13: Review the branch after apply

Review these areas carefully:

- new files in `vocab/`, `property/`, or `class/`
- `context/fullcontext.jsonld`
- `manifest/release-matrix-<from>-<to>.json`
- `manifest/datacite-<version>.json`
- `manifest/datacite-current.json`
- `dist/datacite-<version>.jsonld`
- `dist/datacite-<version>.ttl`
- `dist/datacite-<version>.rdf`
- `index.html`
- `manifest/index.html`

Read the apply report too:

- `reports/release-apply-<version>.md`

## Step 14: Handle anything still marked manual

Some releases will not be fully automatable.

If anything is still `manual`, you have two choices:

1. make the required source-file edits yourself and commit them
2. update the plan with more explicit instructions and rerun the apply workflow

Do not force ambiguous items through automation just to finish quickly.

## Step 15: Open a pull request

When the branch looks correct:

1. open a PR into `main`
2. explain the new DataCite version
3. mention which plan items were applied automatically
4. mention any remaining manual edits
5. mention that the apply workflow completed successfully

## Step 16: Merge to `main`

After the PR is approved, merge it.

This is the step that makes the release official in the repo.

## Step 17: What happens after merge

This repo already has a deploy workflow on `main`.

So:

- merge to `main`
- deploy workflow runs
- merged files are published

The apply workflow itself does not publish to production. It prepares and commits the files. Publishing happens after merge to `main`.

## Local Terminal Path

If you prefer the terminal, these are the equivalent commands.

### Detect

```bash
git checkout main
git pull
git checkout -b upgrade-4.8

node scripts/detect-datacite-release.js
```

Or for a specific version:

```bash
node scripts/detect-datacite-release.js --version 4.8 --release-date 2026-09-01
```

Then edit:

- `reports/release-import-plan-4.8.json`

### Apply

```bash
node scripts/apply-datacite-release-plan.js \
  --plan reports/release-import-plan-4.8.json \
  --modules controlled-list,simple-property,property-group,complex-structure \
  --set-current
```

Then review, commit, and open a PR.

## Troubleshooting

### The detect workflow says there is no newer release

That means the repo is already on the newest official DataCite `4.x` version listed on `versions.html`.

### The apply workflow says it cannot apply a change

Usually one of these is true:

- the plan item is missing required fields
- the change is still ambiguous
- you enabled a module for a change type that still needs manual instructions

Read the error and inspect the matching `change` entry in the plan JSON.

### The plan contains `manual` items

That is expected for unsupported or risky changes.

`manual` does not mean failure. It means a human should decide what to do.

### The workflow artifact exists but nothing changed in the repo

Most likely:

- `commit_generated_files` was `false`
- the approved plan had no `apply` items
- you ran detect instead of apply

### The detect workflow finished but I cannot find the plan file on the branch

Most likely:

- `commit_plan_files` was set to `false`
- the workflow failed before the commit step
- you are looking at a different branch than the one you ran the workflow on

## Practical Checklist

Use this checklist every time:

1. Confirm the newest official version on [versions.html](https://schema.datacite.org/versions.html).
2. Create a branch from `main`.
3. Run `Detect DataCite Release`.
4. Open the committed JSON plan in `reports/` on the branch.
5. Review each change item.
6. Mark items as `apply`, `skip`, or `manual`.
7. Commit the approved JSON plan.
8. Run `Apply DataCite Release Plan`.
9. Review generated files and the apply report.
10. Open a PR.
11. Merge to `main`.
12. Check deployment.
