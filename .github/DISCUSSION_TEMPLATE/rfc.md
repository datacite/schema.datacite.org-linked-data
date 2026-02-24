# RFC Discussion Template

Use this template when opening a GitHub Discussion for:

- schema or ontology changes
- vocabulary additions/changes
- manifest or context changes
- breaking changes
- governance/process changes

Use GitHub Issues for implementation work after an RFC is accepted.

## Title

`[RFC] Short proposal title`

## Summary

One paragraph that explains the proposal and why it matters.

## Problem Statement

What problem or limitation are you trying to solve?

- Who is affected?
- What is the current pain point?
- Why is the current behavior insufficient?

## Goals

- Goal 1
- Goal 2

## Non-Goals

- Out-of-scope item 1
- Out-of-scope item 2

## Proposed Change

Describe the proposed design in enough detail for review.

- Affected resources/files (classes, properties, vocab terms, contexts, manifests)
- URL/IRI patterns (if relevant)
- JSON-LD/RDF modeling changes
- Validation or compatibility behavior

## Examples (Optional but Recommended)

Include before/after examples where possible.

```json
{
  "example": "Add a concrete snippet here"
}
```

## Alternatives Considered

Describe the alternatives you considered and why they are not preferred.

## Compatibility / Migration Impact

- Is this backward compatible?
- Does it introduce breaking changes?
- Is a migration/deprecation path needed?
- What should existing consumers do?

## Risks / Drawbacks

Technical, operational, maintenance, or community risks and mitigations.

## Open Questions (Feedback Requested)

List the specific questions you want feedback on.

- Should we ... ?
- Is ... acceptable?
- Would consumers expect ... ?

## Rollout / Implementation Plan (Optional)

If accepted, outline a likely implementation path.

1. Update schema artifacts
2. Regenerate manifest
3. Update docs/examples
4. Open implementation issue(s)

## Decision / Outcome (Maintainers)

Maintain this section as the discussion progresses.

- Status: Proposed / Accepted / Rejected / Deferred
- Decision date:
- Link to implementation issue(s)/PR(s):
