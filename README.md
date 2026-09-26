# Vault Dashboard

Vault Dashboard turns an Obsidian vault into an immediately useful home view. It provides local vault statistics, read-only journal tasks, quick note links, writing activity, internal-link trends, top-level folder analysis, command buttons, and optional integrations for Templater, Bases, Dataview, and trusted local scripts.

## Usage

Enable the plugin, then use the ribbon icon or **Open workspace** command. Choose **Edit mode** in the view toolbar to add, remove, reorder, resize, and configure component instances. Changes are saved immediately.

The plugin does not use the network, telemetry, accounts, or automatic updates. Native components do not require other plugins. Tasks are read-only: selecting one opens its source line.

Quick Jump can combine folder, tag, and frontmatter key/value filters. For new-note counts, the writing heatmap prefers each note's `created` frontmatter value and falls back to filesystem creation time; word-count mode groups each note's current readable word total by filesystem modification date. It does not claim to reconstruct historical writing volume.

## Dependencies

None required. All native components — statistics, journal tasks, quick links, writing activity, link trends, folder analysis, and command buttons — work without any other plugin. Optional integrations: Dataview (Dataview query component), Templater (quick note creation), and Obsidian's built-in Bases renderer (Bases file component). Each optional integration degrades to an explanatory placeholder when it is unavailable.

## Optional integrations

- Dataview runs only the code in a Dataview query component, through Dataview's API.
- Templater powers only quick note creation.
- Bases files are rendered through Obsidian's Markdown renderer.
- Local JavaScript modules are disabled by default. Scripts are not sandboxed and can read or write the vault; only enable code you trust.

## Data and backup

Workspace configuration and history are stored in `.obsidian/plugins/vault-dashboard/data.json`. Scripts are stored in `.obsidian/plugins/vault-dashboard/data/`. These files are outside normal note backups and may be removed when the plugin is uninstalled. Back up the complete plugin directory before moving devices or uninstalling.

## Platform status

Vault Dashboard targets both desktop and mobile Obsidian. The code is covered by automated checks, but real-device verification is still limited: Windows, macOS, Linux, iOS, and Android, pop-out windows, third-party themes, and the optional integrations have not each been confirmed on a real device. If something behaves oddly on your setup, please open an issue.

## Development

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
```

## Install the test release with BRAT

In BRAT, choose **Add a beta plugin for testing**, enter `luna-jmy/ob-workspace`, install the latest release, then enable **Custom Workspace** in Obsidian's Community plugins settings.

## License

MIT. See [LICENSE](LICENSE).
