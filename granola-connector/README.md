# granola-connector

A local MCP server that lets Claude read your [Granola](https://granola.ai) meeting notes and transcripts.

Granola has no public API, so this reads Granola's local cache file directly:

```
~/Library/Application Support/Granola/cache-v3.json
```

That means it is **macOS-only** and must run on the same Mac as Granola.

## Tools exposed to Claude

- `list_meetings({ limit?, query? })` — recent meetings, optionally filtered by title substring. Returns `id`, `title`, `created_at`.
- `get_meeting({ id, include_transcript? })` — full notes (markdown) and, by default, the transcript for one meeting.

A typical Claude turn: call `list_meetings` to find the meeting id, then `get_meeting` to pull the content.

## Install

```bash
cd granola-connector
npm install
npm run build
```

This produces `dist/index.js`. Note the absolute path to it — you'll need it below.

## Wire it up to Claude

### Claude Code

```bash
claude mcp add granola -- node /absolute/path/to/granola-connector/dist/index.js
```

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "granola": {
      "command": "node",
      "args": ["/absolute/path/to/granola-connector/dist/index.js"]
    }
  }
}
```

Then restart Claude Desktop. You should see a `granola` tool in the tool list.

## Configuration

- `GRANOLA_CACHE_PATH` — override the cache file location (useful if Granola changes the path in a future release, or if you want to point at a copy).

To pass it in Claude Desktop, add it under `env`:

```json
{
  "mcpServers": {
    "granola": {
      "command": "node",
      "args": ["/absolute/path/to/granola-connector/dist/index.js"],
      "env": { "GRANOLA_CACHE_PATH": "/some/other/path.json" }
    }
  }
}
```

## Troubleshooting

- **"Could not read Granola cache"** — make sure Granola is installed and you've recorded at least one meeting. Confirm the file exists: `ls -l ~/Library/Application\ Support/Granola/cache-v3.json`.
- **Tool calls return `(no transcript)`** — the meeting hasn't been transcribed yet, or it's an imported note without audio.
- **The schema looks different** — Granola occasionally changes its cache layout. The reader handles two known shapes (`state.documents` and top-level `documents`); if neither matches your file, open the cache and adjust `getDocuments` / `getTranscriptFor` in `src/index.ts`.

## Limits

- Read-only. There's no `create_note` tool because Granola has no documented write API.
- No live sync. Each tool call re-reads the cache file, so new meetings appear as soon as Granola flushes them to disk (usually a few seconds after the meeting ends).
