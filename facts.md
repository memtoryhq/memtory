# Memtory

> Memtory is the project manager for your AI coding agents. It scans a repository, writes a shared roadmap, backlog and decision log into `.ai/`, and lets agents like Claude Code claim tasks, record why they made each change, and stay in sync with your team.

Updated: 2026-10-05
Status: early access. The hosted app at memtory.com is launching soon.

## What it is

- A headless orchestration platform for repository work. It is not an IDE and not a coding assistant; it manages the agents you already use.
- One shared plan per repository: roadmap, backlog (a graph of components, epics and tasks) and a searchable decision log.
- The plan lives on a shared server, and a snapshot is written into the repo's `.ai/` folder for agents to read.

## Live today

- MCP server for Claude Code: backlog, context, decisions, and task claim and complete.
- CLI: one `init` command scans a repo, writes `.ai/` and `CLAUDE.md`, and registers the MCP server.
- Backlog graph canvas in the web dashboard.
- Decision log: every completed task records what was done and why.
- Team sync on one shared server, with members and teams.
- GitHub sign-in and GitHub App integration.
- Safe parallel sessions: a checkout lease plus git worktrees, so two agent sessions don't edit the same checkout.

## Coming soon

- Codex and GitHub Copilot as execution agents (only Claude Code runs tasks today).
- More repository hosts beyond GitHub.
- More integrations.

## Pricing

- Free: $0, 500 AI credits to start.
- Pro: $20 per month, 1,500 AI credits per month.
- Team: $40 per seat per month, 4,500 AI credits per seat per month.

## Links

- Website: https://memtory.com
- Source for this package: https://github.com/memtoryhq/memtory
- npm: https://www.npmjs.com/package/memtory
