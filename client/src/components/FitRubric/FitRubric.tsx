import { Sparkles } from "lucide-react";

import type { Rubric } from "../../types/search";
import "./FitRubric.css";

type FitRubricProps = {
  rubric: Rubric;
  frozen: boolean;
  onChange: (rubric: Rubric) => void;
};

export function FitRubric({
  rubric,
  frozen,
  onChange,
}: FitRubricProps) {
  function updateSummary(summary: string) {
    onChange({
      ...rubric,
      summary,
    });
  }

  function updateCriterion(
    index: number,
    field: "name" | "description" | "importance",
    value: string
  ) {
    const criteria = rubric.criteria.map(
      (criterion, criterionIndex) =>
        criterionIndex === index
          ? {
              ...criterion,
              [field]: value,
            }
          : criterion
    );

    onChange({
      ...rubric,
      criteria,
    });
  }

  return (
    <section className="section rubric-section">
      <span className="eyebrow">
        <Sparkles size={14} />
        AI fit rubric
      </span>

      <h2>What makes a strong candidate</h2>

      <textarea
        className="rubric-summary-input"
        value={rubric.summary}
        onChange={(e) =>
          updateSummary(e.target.value)
        }
        disabled={frozen}
      />

      <div className="criteria">
        {rubric.criteria.map((criterion, index) => (
          <div className="criterion" key={index}>
            <div className="criterion-top">
              <input
                className="criterion-name-input"
                value={criterion.name}
                onChange={(e) =>
                  updateCriterion(
                    index,
                    "name",
                    e.target.value
                  )
                }
                disabled={frozen}
              />

              <select
                className={`importance ${criterion.importance}`}
                value={criterion.importance}
                onChange={(e) =>
                  updateCriterion(
                    index,
                    "importance",
                    e.target.value
                  )
                }
                disabled={frozen}
              >
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
            </div>

            <textarea
              className="criterion-description-input"
              value={criterion.description}
              onChange={(e) =>
                updateCriterion(
                  index,
                  "description",
                  e.target.value
                )
              }
              disabled={frozen}
            />
          </div>
        ))}
      </div>
    </section>
  );
}