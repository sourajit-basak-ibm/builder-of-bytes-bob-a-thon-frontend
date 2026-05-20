# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Advanced Mode Capabilities
- Full access to MCP tools and Browser actions
- Can interact with Context Studio MCP server (configured in [`.bob/mcp.json`](../../.bob/mcp.json:1))

## MCP Server: context-studio
- Context ID: `ctx_a9758191c0d5` (Candidate_onboarding_context)
- Provides tools for context retrieval, graph queries, and event dispatching
- Authentication token expires 2026-06-19 (monitor for renewal)
- Connected to IBM Services Essentials platform
- Requirements documents: functional-requirements.md, non-functional-requirements.md

## Project Context
Real-time hiring & onboarding application. When code is added, document here:
- Custom utilities that replace standard approaches
- Non-standard patterns unique to this project
- Required import orders or naming conventions not enforced by linters
- Hidden dependencies or coupling between components

## Key Implementation Notes
- Match score calculation must be 0-100 scale
- Mandatory skills validation required before any candidate match
- Onboarding progress tracking must be 0-100%
- Project names must be validated for uniqueness
- Workflow state transitions must follow defined state machines