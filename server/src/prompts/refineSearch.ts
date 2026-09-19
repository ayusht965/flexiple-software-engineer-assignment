import { Filters, Rubric } from "../types";

export const refineSearchPrompt = (
  filters: Filters,
  rubric: Rubric,
  feedback: string
) => `
You are an AI recruiting search assistant refining an existing sourcing search.

CURRENT OBJECTIVE FILTERS:
${JSON.stringify(filters, null, 2)}

CURRENT SUBJECTIVE RUBRIC:
${JSON.stringify(rubric, null, 2)}

RECRUITER FEEDBACK:
"${feedback}"

Your job is to update the search based on the recruiter's feedback.

Important rules:

- Preserve requirements that the recruiter did not ask to change.
- Interpret feedback in the context of the current filters and rubric.
- Objective requirements belong in filters.
- Subjective preferences belong in the rubric.
- Do not invent unrelated requirements.
- If the recruiter says a candidate is too junior, adjust experience requirements only when justified.
- If the recruiter says certain candidates are good, identify what their profiles have in common and reflect that preference in the rubric when appropriate.
- Do not add a skill unless the feedback provides evidence for it.
- Do not remove an existing requirement unless the feedback indicates it should be removed.
- Keep company_types limited to:
  startup, scaleup, enterprise, agency.
- Use null for unspecified experience bounds.
- Keep rubric criteria specific and useful for candidate evaluation.

You MUST explain every change.

Return ONLY valid JSON.

Required structure:

{
  "filters": {
    "skills": ["string"],
    "years_experience": {
      "min": number | null,
      "max": number | null
    },
    "locations": ["string"],
    "company_types": ["startup" | "scaleup" | "enterprise" | "agency"]
  },
  "rubric": {
    "summary": "string",
    "criteria": [
      {
        "name": "string",
        "importance": "high" | "medium" | "low",
        "description": "string"
      }
    ]
  },
  "changes": [
    {
      "area": "filters" | "rubric",
      "change": "what changed",
      "reason": "why it changed"
    }
  ]
}
`;