# Changelog

## 0.2.2

### Fixed

- Width selector buttons in edit mode replaced with compact proportional bars
  (25% / 33% / 50% / 100%) instead of four text labels — no longer squeeze or overflow in
  quarter- and third-width cards. Applies to every component (the control bar is shared).

## 0.2.1

### Fixed

- Edit-mode header no longer overflows on any width: the header wraps unconditionally, the
  component title truncates with an ellipsis instead of pushing the control buttons off-screen,
  and controls align right; the add-component buttons stack full-width on mobile.

## 0.2.0

### Breaking: plugin renamed

- **Plugin id `custom-workspace` → `vault-dashboard`, name "Custom Workspace" → "Vault Dashboard"**
  (an existing community plugin shares the old name, and "workspace" is an official Obsidian
  concept — this plugin is a vault dashboard). The internal `cw-` CSS prefix and view type are
  unchanged. **Migration**: remove the old plugin folder in `.obsidian/plugins/custom-workspace/`
  after updating (BRAT installs the new id); workspace layout resets to defaults — reconfigure
  once, or copy the old `data.json` to the new folder to keep your layout.

### Added

- **Recent Notes component** ("最近新增"): lists notes created in the last X days (default 30,
  limit 20), filtered by folder / tag / frontmatter like Quick Jump; creation date prefers
  frontmatter `created`, falling back to file creation time; click to open.
- **Dataview component supports plain queries**: code starting with
  `TABLE / LIST / TASK / CALENDAR / FROM` now renders as a Dataview query
  (tryQueryMarkdown + MarkdownRenderer); anything else runs as DataviewJS via the official
  executeJs entry — the same query you use in notes now works in the component.

### Fixed

- Edit mode no longer scrolls back to the top after adding/removing/reordering components.
- Mobile edit mode: width options hidden (single column anyway), control buttons compacted to
  stop overflow.

## 0.1.11

- Resolve Quick Create templates from Templater's configured template folder, accepting paths both with and without the `.md` extension.
- List available Templater templates in Quick Create settings for reliable selection.
- Add a visible theme-aware border and hover feedback to Quick Start command buttons.

## 0.1.10

- Prevent long Quick Jump note titles from overflowing narrow cards.
- Support multiple Quick Create buttons with independent labels, templates, folders, filename patterns, and title variables.
- Add ordering controls to Command and Quick Create buttons.
- Use distinct theme-aware colors for Command and Quick Create actions.
- Migrate existing single-button Quick Create settings without losing their template configuration.

## 0.1.9

- Rename the workspace tab to My Workspace and use a distinct home icon.
- Restore drag-and-drop component reordering in edit mode.
- Replace the cumulative word-count chart with a 30-day daily net-change chart centered on zero.
- Prefer frontmatter `created` when reconstructing estimated history, preserve real snapshots during migration, and clarify that link-addition dates cannot be recovered.

## 0.1.8

- Reuse the BRAT-tested release workflow from Obsidian Task Matrix.
- Stage release assets in `release/` and publish them together with explicit tag, title, and changelog metadata.

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
