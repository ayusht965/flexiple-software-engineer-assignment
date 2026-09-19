# flexiple-software-engineer-assignment
# Sourcing Refinement Loop

An AI-assisted recruiter workflow for turning a natural-language hiring requirement into an editable sourcing search, ranking candidates, and iteratively refining the search based on recruiter feedback.

## What it does

The application supports a complete sourcing refinement loop:

1. Recruiter enters a hiring requirement in plain language.
2. A server-side LLM converts it into:
   - Objective filters
   - A subjective candidate-fit rubric
3. Recruiter can review and edit the generated criteria.
4. Objective filters are applied locally against the supplied candidate dataset.
5. The LLM ranks the filtered candidates against the fit rubric.
6. Recruiters can provide:
   - Per-candidate Yes/No feedback
   - Natural-language refinement feedback
7. The LLM updates the filters/rubric and explains what changed and why.
8. The search is rerun with the refined criteria.
9. The recruiter can freeze the search and review the final filters, rubric, and shortlist.

## Tech stack

### Frontend
- React
- TypeScript
- Vite
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- Zod

### AI
- OpenRouter
- Server-side LLM API
- Structured JSON responses
- Zod validation

## Architecture

```text
Recruiter requirement
        |
        v
   Server /parse
        |
        v
   LLM interpretation
        |
        v
Editable filters + rubric
        |
        v
 Local objective filtering
        |
        v
Filtered candidate profiles
        |
        v
   LLM ranking
        |
        v
Top candidate shortlist
        |
        v
Recruiter feedback
        |
        v
   Server /refine
        |
        v
Updated filters + rubric
        |
        v
Local filtering + LLM ranking
        |
        v
     New shortlist
        |
        v
       Freeze