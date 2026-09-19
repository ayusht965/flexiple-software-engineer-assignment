import { Check, X } from "lucide-react";
import type { Profile, Ranking } from "../../types/search";
import "./CandidateCard.css";

type CandidateFeedback = "yes" | "no";

type CandidateCardProps = {
  profile: Profile;
  ranking: Ranking;
  rank: number;
  feedback?: CandidateFeedback;
  onFeedbackChange?: (
    profileId: string,
    feedback: CandidateFeedback
  ) => void;
};

export function CandidateCard({
  profile,
  ranking,
  rank,
  feedback,
  onFeedbackChange,
}: CandidateCardProps) {
  return (
    <article className="candidate-card">
      <div className="rank">{rank}</div>

      <div className="candidate-main">
        <div className="candidate-heading">
          <div>
            <h3>{profile.name}</h3>

            <p>
              {profile.current_title} ·{" "}
              {profile.years_experience} years
            </p>
          </div>

          <div className="score">
            <strong>{ranking.score}</strong>
            <span>fit</span>
          </div>
        </div>

        <div className="candidate-meta">
          <span>{profile.location}</span>
          <span>{profile.current_company}</span>
          <span>{profile.current_company_type}</span>
        </div>

        <p className="explanation">
          {ranking.explanation}
        </p>

        <div className="chips">
          {profile.skills.slice(0, 6).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>

        {ranking.concerns.length > 0 && (
          <div className="concerns">
            {ranking.concerns.map((concern) => (
              <span key={concern}>{concern}</span>
            ))}
          </div>
        )}

        {onFeedbackChange && (
          <div className="candidate-feedback">
            <span className="candidate-feedback-label">
              Recruiter feedback
            </span>

            <div className="candidate-feedback-actions">
              <button
                type="button"
                className={`feedback-choice yes ${
                  feedback === "yes" ? "selected" : ""
                }`}
                onClick={() =>
                  onFeedbackChange(profile.id, "yes")
                }
              >
                <Check size={14} />
                Strong fit
              </button>

              <button
                type="button"
                className={`feedback-choice no ${
                  feedback === "no" ? "selected" : ""
                }`}
                onClick={() =>
                  onFeedbackChange(profile.id, "no")
                }
              >
                <X size={14} />
                Not a fit
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}