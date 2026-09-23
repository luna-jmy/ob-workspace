# Changelog

## 0.1.7

- Create the public GitHub release before uploading BRAT assets, avoiding GitHub's empty embedded asset list for draft-first releases.
- Upload release assets sequentially and require the anonymous BRAT API response to expose all three files before the workflow succeeds.

## 0.1.6

- Publish GitHub releases only after BRAT's required assets have finished uploading.
- Verify release metadata through the same anonymous GitHub API path used by BRAT.

## 0.1.5

- Prefer valid frontmatter `created` values for new-note heatmap dates, falling back to filesystem creation time only when needed.
- Group word-count heatmap values by filesystem modification date and switch quarter-width heatmaps to a square matrix.
- Add Base file selection, validation, embedded preview, and open fallback behavior.
- Add Dataview query context, empty and invalid configuration states, and safe repeated test runs.
- Keep edit-mode layout changes on explicit controls only.

## 0.1.4

- Fix the internal-link chart crash caused by passing multiple SVG classes as one DOM token.
- Prevent the 365-day heatmap from overflowing narrow component cards.
- Add tag and frontmatter key/value filters to Quick Jump.
- Add live path search to every note drill-down modal.
- Let the heatmap display either current readable words or new-note counts grouped by note creation date.

## 0.1.3

- Remove the graph component and migrate existing graph cards out of saved workspaces.
- Add a 365-day writing heatmap based on each Markdown note's latest modification date.
- Add an internal-link history chart with clearly distinguished estimated history.
- Add top-level folder analysis with note counts, readable word counts, proportional bars, and note drill-down.

## 0.1.2

- Wrap long task text correctly at narrow component widths.
- Add a workspace refresh action, live component-setting previews, and drag-and-drop reordering in edit mode.
- Move the optional short-note metric into vault statistics and migrate existing note-health cards.
- Add readable axes and labels to the words trend chart.
- Remove the inaccurate graph imitation and explain that Obsidian does not expose a public native-graph embedding API.

## 0.1.1

- Show metric drill-down results in a closable modal.
- Make edit mode visually distinct and expose direct 1/4, 1/3, 1/2, and full-width controls.
- Render a native one-hop graph preview inside the graph component.
- Let each vault-stat component choose which metrics it displays.

## 0.1.0

- Initial implementation of the Custom Workspace view, native components, edit mode, optional integrations, history, and local script modules.
