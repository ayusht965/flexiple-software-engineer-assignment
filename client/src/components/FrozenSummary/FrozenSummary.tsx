import { Lock } from "lucide-react";
import type { Profile, Ranking, SearchSpec } from "../../types/search";
import "./FrozenSummary.css";

type FrozenSummaryProps = {
  spec: SearchSpec;
  profiles: Profile[];
  rankings: Ranking[];
};

export function FrozenSummary({
  spec,
  profiles,
  rankings,
}: FrozenSummaryProps) {
  return (
    <section className="frozen-summary">
      <div className="frozen-header">
        <div className="frozen-title">
          <Lock size={17} />
          <div>
            <span>Final result</span>
            <h2>Search frozen</h2>
          </div>
        </div>

        <span className="frozen-badge">Locked</span>
      </div>

      <div className="frozen-content">
        <div className="frozen-section">
          <span className="frozen-label">Objective filters</span>

          <div className="frozen-chips">
            {spec.filters.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}

            {spec.filters.locations.map((location) => (
              <span key={location}>{location}</span>
            ))}

            {spec.filters.years_experience.min !== null && (
              <span>
                {spec.filters.years_experience.min}+ years
              </span>
            )}

            {spec.filters.years_experience.max !== null && (
              <span>
                ≤ {spec.filters.years_experience.max} years
              </span>
            )}

            {spec.filters.company_types.map((type) => (
              <span key={type}>{type}</span>
            ))}

            {spec.filters.skills.length === 0 &&
              spec.filters.locations.length === 0 &&
              spec.filters.years_experience.min === null &&
              spec.filters.years_experience.max === null &&
              spec.filters.company_types.length === 0 && (
                <span> No objective filters</span>
              )}
          </div>
        </div>

        <div className="frozen-section">
          <span className="frozen-label">Fit rubric</span>

          <p className="frozen-rubric-summary">
            {spec.rubric.summary}
          </p>

          <div className="frozen-criteria">
            {spec.rubric.criteria.map((criterion) => (
              <div key={criterion.name}>
                <strong>{criterion.name}</strong>
                <span>{criterion.importance}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="frozen-section">
          <div className="frozen-shortlist-header">
            <span className="frozen-label">
              Final shortlist
            </span>

            <span>
              {rankings.length} candidates
            </span>
          </div>

          <div className="frozen-shortlist">
            {rankings.map((ranking, index) => {
              const profile = profiles.find(
                (candidate) =>
                  candidate.id === ranking.profile_id
              );

              if (!profile) return null;

              return (
                <div
                  className="frozen-candidate"
                  key={profile.id}
                >
                  <span className="frozen-rank">
                    {index + 1}
                  </span>

                  <div>
                    <strong>{profile.name}</strong>
                    <span>
                      {profile.current_title} ·{" "}
                      {profile.location}
                    </span>
                  </div>

                  <strong className="frozen-score">
                    {ranking.score}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}