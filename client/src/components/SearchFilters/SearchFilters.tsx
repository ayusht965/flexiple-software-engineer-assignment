import {
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import "./SearchFilters.css";

import type { Filters } from "../../types/search";

type SearchFiltersProps = {
  filters: Filters;
  frozen: boolean;
  onUpdate: <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => void;
  onApply: () => void;
};

const companyTypes = [
  "startup",
  "scaleup",
  "enterprise",
  "agency",
];

export function SearchFilters({
  filters,
  frozen,
  onUpdate,
  onApply,
}: SearchFiltersProps) {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <span className="eyebrow">
            <SlidersHorizontal size={14} />
            Objective filters
          </span>

          <h2>Search criteria</h2>
        </div>

        <button
          className="secondary-button"
          onClick={onApply}
          disabled={frozen}
        >
          <RefreshCw size={15} />
          Apply changes
        </button>
      </div>

      <div className="filter-grid">
        <label>
          <span>Skills</span>

          <input
            value={filters.skills.join(", ")}
            onChange={(e) =>
              onUpdate(
                "skills",
                e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              )
            }
            disabled={frozen}
            placeholder="Node.js, PostgreSQL"
          />
        </label>

        <label>
          <span>Locations</span>

          <input
            value={filters.locations.join(", ")}
            onChange={(e) =>
              onUpdate(
                "locations",
                e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              )
            }
            disabled={frozen}
            placeholder="Bangalore, Mumbai"
          />
        </label>

        <label>
          <span>Min experience</span>

          <input
            type="number"
            min="0"
            max="50"
            value={filters.years_experience.min ?? ""}
            onChange={(e) =>
              onUpdate("years_experience", {
                ...filters.years_experience,
                min: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            disabled={frozen}
            placeholder="0"
          />
        </label>

        <label>
          <span>Max experience</span>

          <input
            type="number"
            min="0"
            max="50"
            value={filters.years_experience.max ?? ""}
            onChange={(e) =>
              onUpdate("years_experience", {
                ...filters.years_experience,
                max: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            disabled={frozen}
            placeholder="Any"
          />
        </label>

        <label>
          <span>Company type</span>

          <select
            value={filters.company_types[0] ?? ""}
            onChange={(e) =>
              onUpdate(
                "company_types",
                e.target.value ? [e.target.value] : []
              )
            }
            disabled={frozen}
          >
            <option value="">Any company</option>

            {companyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() +
                  type.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}