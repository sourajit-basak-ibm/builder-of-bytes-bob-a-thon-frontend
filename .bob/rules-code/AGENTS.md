# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Code Mode Restrictions
- No access to MCP tools or Browser actions
- Focus on direct code editing and file operations

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