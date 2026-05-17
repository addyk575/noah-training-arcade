#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const DEFAULT_CACHE_PATH = join(
  homedir(),
  "Library",
  "Application Support",
  "Granola",
  "cache-v3.json",
);

const CACHE_PATH = process.env.GRANOLA_CACHE_PATH ?? DEFAULT_CACHE_PATH;

type GranolaDocument = {
  id: string;
  title?: string;
  created_at?: string;
  updated_at?: string;
  notes_markdown?: string;
  notes_plain?: string;
  last_viewed_panel?: {
    content?: { markdown?: string };
  };
};

type TranscriptSegment = {
  text?: string;
  speaker?: string;
  source?: string;
  start_time?: string | number;
  end_time?: string | number;
};

type GranolaState = {
  documents?: GranolaDocument[];
  transcripts?: Record<string, TranscriptSegment[]>;
};

type GranolaCache = {
  state?: GranolaState;
} & GranolaState;

async function readCache(): Promise<GranolaCache> {
  const raw = await readFile(CACHE_PATH, "utf8");
  const outer = JSON.parse(raw) as { cache?: string } & Record<string, unknown>;
  const inner =
    typeof outer.cache === "string" ? (JSON.parse(outer.cache) as GranolaCache) : (outer as GranolaCache);
  return inner;
}

function getDocuments(cache: GranolaCache): GranolaDocument[] {
  return cache.state?.documents ?? cache.documents ?? [];
}

function getTranscriptFor(cache: GranolaCache, id: string): TranscriptSegment[] {
  const map = cache.state?.transcripts ?? cache.transcripts ?? {};
  return map[id] ?? [];
}

function extractMarkdown(doc: GranolaDocument): string {
  if (doc.notes_markdown && doc.notes_markdown.trim()) return doc.notes_markdown;
  const panelMd = doc.last_viewed_panel?.content?.markdown;
  if (panelMd && panelMd.trim()) return panelMd;
  if (doc.notes_plain && doc.notes_plain.trim()) return doc.notes_plain;
  return "";
}

function formatTranscript(segments: TranscriptSegment[]): string {
  const lines: string[] = [];
  let lastSpeaker: string | undefined;
  for (const seg of segments) {
    const text = (seg.text ?? "").trim();
    if (!text) continue;
    const speaker = seg.speaker ?? seg.source ?? "Unknown";
    if (speaker !== lastSpeaker) {
      lines.push(`\n${speaker}:`);
      lastSpeaker = speaker;
    }
    lines.push(text);
  }
  return lines.join("\n").trim();
}

function sortByCreatedDesc(docs: GranolaDocument[]): GranolaDocument[] {
  return [...docs].sort((a, b) => {
    const aTime = a.created_at ? Date.parse(a.created_at) : 0;
    const bTime = b.created_at ? Date.parse(b.created_at) : 0;
    return bTime - aTime;
  });
}

const server = new Server(
  { name: "granola-connector", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_meetings",
      description:
        "List Granola meetings, most recent first. Returns id, title, and created date. Call this first to find the meeting id you want, then pass it to get_meeting.",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Max meetings to return (default 25).",
          },
          query: {
            type: "string",
            description: "Optional case-insensitive substring to match against the meeting title.",
          },
        },
      },
    },
    {
      name: "get_meeting",
      description:
        "Fetch a single Granola meeting by id. Returns the AI-enhanced notes (markdown) and, by default, the transcript.",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Meeting id, as returned by list_meetings.",
          },
          include_transcript: {
            type: "boolean",
            description: "Whether to include the transcript body (default true).",
          },
        },
        required: ["id"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  let cache: GranolaCache;
  try {
    cache = await readCache();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Could not read Granola cache at ${CACHE_PATH}: ${msg}\n\nMake sure Granola is installed and you've recorded at least one meeting. Set GRANOLA_CACHE_PATH to override the path.`,
        },
      ],
    };
  }

  const docs = getDocuments(cache);

  if (request.params.name === "list_meetings") {
    const args = (request.params.arguments ?? {}) as { limit?: number; query?: string };
    const limit = args.limit ?? 25;
    let filtered = docs;
    if (args.query) {
      const needle = args.query.toLowerCase();
      filtered = filtered.filter((d) => (d.title ?? "").toLowerCase().includes(needle));
    }
    const out = sortByCreatedDesc(filtered)
      .slice(0, limit)
      .map((d) => ({
        id: d.id,
        title: d.title ?? "(untitled)",
        created_at: d.created_at ?? null,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
    };
  }

  if (request.params.name === "get_meeting") {
    const args = (request.params.arguments ?? {}) as {
      id?: string;
      include_transcript?: boolean;
    };
    if (!args.id) {
      return {
        isError: true,
        content: [{ type: "text", text: "Missing required argument: id" }],
      };
    }
    const doc = docs.find((d) => d.id === args.id);
    if (!doc) {
      return {
        isError: true,
        content: [{ type: "text", text: `No meeting found with id ${args.id}` }],
      };
    }
    const includeTranscript = args.include_transcript ?? true;
    const notes = extractMarkdown(doc);
    const parts: string[] = [];
    parts.push(`# ${doc.title ?? "(untitled)"}`);
    if (doc.created_at) parts.push(`Date: ${doc.created_at}`);
    parts.push("", "## Notes", notes || "(no notes)");
    if (includeTranscript) {
      const segments = getTranscriptFor(cache, args.id);
      parts.push("", "## Transcript");
      parts.push(segments.length ? formatTranscript(segments) : "(no transcript)");
    }
    return {
      content: [{ type: "text", text: parts.join("\n") }],
    };
  }

  return {
    isError: true,
    content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("granola-connector failed to start:", err);
  process.exit(1);
});
