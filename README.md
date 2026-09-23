# Custom Workspace

Custom Workspace turns an Obsidian vault into an immediately useful home view. It provides local vault statistics, read-only journal tasks, quick note links, note-health checks, history trends, command buttons, graph access, and optional integrations for Templater, Bases, Dataview, and trusted local scripts.

## Usage

Enable the plugin, then use the ribbon icon or **Open workspace** command. Choose **Edit mode** in the view toolbar to add, remove, reorder, resize, and configure component instances. Changes are saved immediately.

The plugin does not use the network, telemetry, accounts, or automatic updates. Native components do not require other plugins. Tasks are read-only: selecting one opens its source line.

## Optional integrations

- Dataview runs only the code in a Dataview query component, through Dataview's API.
- Templater powers only quick note creation.
- Bases files are rendered through Obsidian's Markdown renderer.
- Local JavaScript modules are disabled by default. Scripts are not sandboxed and can read or write the vault; only enable code you trust.

## Data and backup

Workspace configuration and history are stored in `.obsidian/plugins/custom-workspace/data.json`. Scripts are stored in `.obsidian/plugins/custom-workspace/data/`. These files are outside normal note backups and may be removed when the plugin is uninstalled. Back up the complete plugin directory before moving devices or uninstalling.

## Platform status

The manifest targets desktop and mobile Obsidian without runtime Node or Electron dependencies. Automated type, lint, unit, and production-build checks cover the source only. Windows, macOS, Linux, iOS, Android, pop-out windows, third-party themes, optional integrations, and Obsidian GUI behavior remain unverified until recorded in a test vault.

## Development

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
```

## License

MIT. See [LICENSE](LICENSE).
