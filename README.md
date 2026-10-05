# Memtory

**Memtory is the project manager for your AI coding agents.** It scans a repository, writes a shared roadmap, backlog and decision log into `.ai/`, and lets agents like Claude Code claim tasks, record why they made each change, and stay in sync with your team.

> Early access. The hosted app at [memtory.com](https://memtory.com) is launching soon. This package is the public CLI and MCP server entry point. Today it serves Memtory's public facts, and it will grow into the full CLI.

## Try it

```sh
npx memtory          # what Memtory is, what's live, what's coming
npx memtory mcp      # start the MCP server (stdio)
```

Add it to Claude Code:

```sh
claude mcp add memtory -- npx -y memtory mcp
```

The MCP server exposes one read-only tool, `memtory_about`, which returns the same facts as [`facts.md`](facts.md).

## What's live

- MCP server for Claude Code: backlog, context, decisions, and task claim and complete.
- CLI `init`: scans a repo, writes `.ai/` and `CLAUDE.md`, and registers the MCP server.
- Backlog graph canvas in the web dashboard.
- Decision log: every completed task records what was done and why.
- Team sync on one shared server.
- GitHub sign-in and GitHub App integration.
- Safe parallel agent sessions through a checkout lease and git worktrees.

## Coming soon

- Codex and GitHub Copilot as execution agents.
- More repository hosts beyond GitHub.
- More integrations.

## Pricing

Free ($0, 500 AI credits to start) · Pro ($20/month) · Team ($40/seat/month). See [facts.md](facts.md) for details.

## License

[MIT](LICENSE). This license covers the code in this repository.
