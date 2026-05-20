# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Plan Mode Purpose
- Design and strategize before implementation
- Create technical specifications and architecture plans
- Break down complex problems into actionable steps

## Project Context
Real-time hiring & onboarding application requiring microservices architecture with independent deployment.

## Architectural Constraints
- Microservices architecture required for modularity
- Performance target: <2s response time, 10K concurrent users
- Availability: 99.9% uptime with disaster recovery
- Security: MFA, RBAC, TLS 1.3, AES-256 encryption
- Testing: 80% code coverage, automated CI/CD
- Integration requirements: Outlook Calendar, Microsoft Teams, LinkedIn, HR systems

## Key Design Considerations
- Architecture documentation must be auto-generated from codebase
- Training programs auto-created during onboarding workflow
- Automated candidate matching with 0-100 scoring
- State machine patterns for workflow management
- Event-driven notifications across multiple channels

## Documentation Notes
When code is added, document here:
- Hidden coupling between components
- Undocumented architectural decisions
- Non-standard patterns that must be followed
- Performance bottlenecks discovered through investigation