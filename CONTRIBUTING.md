# Contributing to `schema.datacite.org-linked-data`

Thanks for contributing.

This repository contains linked-data schema artifacts for DataCite metadata, including:

- class definitions
- property definitions
- controlled vocabularies (terms)
- JSON-LD contexts
- manifests
- documentation and index pages

## How to Contribute

Use the workflow below so design discussion and implementation tracking stay clear.

## Discussions vs Issues

Use **GitHub Discussions** for:

- RFCs / proposals
- schema design questions
- vocabulary additions or changes
- context / manifest design changes
- breaking-change discussions
- requests for feedback before implementation

Use **GitHub Issues** for:

- accepted implementation work
- bugs
- actionable tasks
- follow-up items tied to a decision

Recommended flow:

1. Open a Discussion (RFC / proposal)
2. Gather feedback and refine the proposal
3. Maintainers record a decision (`Accepted`, `Rejected`, `Deferred`)
4. Open Issue(s) for implementation (if accepted)
5. Submit PR(s)

## RFC Proposals

If you are proposing a change, please use the RFC structure in:

- `.github/DISCUSSION_TEMPLATE/rfc.md`

At minimum, include:

- summary
- problem statement
- goals / non-goals
- proposed change
- examples (where possible)
- compatibility / migration impact
- alternatives considered
- open questions for reviewers

## Pull Requests

When submitting a PR:

- link the relevant Discussion and/or Issue
- describe what changed and why
- note any manifest/context regeneration performed
- include examples or screenshots for documentation/index-page changes

## Local Maintenance (Manifest and Index Pages)

If your changes affect schema artifacts, manifests, or directory indexes, these scripts may be relevant:

- `node scripts/manifest-sync.js --check`
- `node scripts/manifest-sync.js --write --validate`
- `node scripts/manifest-sync.js --write --validate --version 4.7`
- `node scripts/build-distribution.js --version 4.7`
- `node scripts/update-current-pointers.js --version 4.7`
- `node scripts/release-snapshot.js --version 4.7 --release-date 2026-03-03`
- `node scripts/generate-index-pages.js`

## Community Expectations

Please keep contributions and discussions:

- respectful
- specific
- evidence-based
- focused on clear technical outcomes
