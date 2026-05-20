# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Ask Mode Purpose
- Provide explanations and documentation
- Answer technical questions without making code changes
- Analyze existing code and provide recommendations

## Project Context
Real-time hiring & onboarding application with comprehensive requirements in Context Studio (ctx_a9758191c0d5).

## Key Domain Knowledge
- Candidate workflow: Sourced → Screening → Interviewing → Shortlisted → Hired/Rejected
- Project states: PLANNING → ACTIVE → ON_HOLD → COMPLETED
- Onboarding states: Initiated → InProgress → Completed
- Skill proficiency levels: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- Match scoring: 0-100 scale, >70 auto-considered
- Interview panel roles: LEAD, TECHNICAL_EXPERT, HR_REPRESENTATIVE

## Documentation Notes
When code is added, document here:
- Hidden or misnamed documentation
- Counterintuitive code organization
- Misleading folder names or structures
- Important context not evident from file structure