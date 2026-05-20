# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview
Real-time hiring & onboarding application for candidate management, interview scheduling, and onboarding workflows.

## Context Studio Integration
- Context ID: `ctx_a9758191c0d5` (Candidate_onboarding_context)
- MCP server configured in [`.bob/mcp.json`](.bob/mcp.json:1)
- Bearer token expires 2026-06-19
- Requirements stored in Context Studio: functional-requirements.md, non-functional-requirements.md

## Key Domain Entities
- Projects with technology stacks and workflow states (PLANNING, ACTIVE, ON_HOLD, COMPLETED)
- Candidates (INTERNAL/EXTERNAL) with skill matching (0-100 score, >70 auto-considered)
- Interview panels with technology focus and role-based members
- Onboarding workflows with training program assignment and progress tracking (0-100%)
- Skill requirements with proficiency levels (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)

## Critical Business Rules
- Project names must be unique system-wide
- Mandatory skills must be present for any candidate match
- Onboarding only starts after successful face-to-face meeting
- Interview panels require at least one technical expert
- Training programs auto-created during onboarding
- Architecture documentation auto-generated from codebase

## Non-Functional Requirements
- Performance: <2s response time, 10K concurrent users
- Availability: 99.9% uptime with disaster recovery
- Security: MFA, RBAC, TLS 1.3, AES-256 encryption
- Testing: 80% code coverage, automated CI/CD pipeline
- Microservices architecture with independent deployment