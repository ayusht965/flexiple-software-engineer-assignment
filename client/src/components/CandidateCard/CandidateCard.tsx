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
      <div className="candidate-rank">
        <span>{rank}</span>
      </div>

      <div className="candidate-main">
        <div className="candidate-top">
          <div className="candidate-identity">
            <h3>{profile.name}</h3>

            <p>
              {profile.current_title}
              <span> · </span>
              {profile.years_experience} years
            </p>
          </div>

          <div className="candidate-score">
            <strong>{ranking.score}</strong>
            <span>FIT</span>
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

        <div className="candidate-evidence">
          <div className="evidence-group">
            <span className="evidence-label">Skills</span>

            <div className="chips">
              {profile.skills.slice(0, 5).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>

          {ranking.concerns.length > 0 && (
            <div className="evidence-group concerns-group">
              <span className="evidence-label">Watch</span>

              <div className="concerns">
                {ranking.concerns.slice(0, 2).map((concern) => (
                  <span key={concern}>{concern}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {onFeedbackChange && (
          <div className="candidate-feedback">
            <span className="candidate-feedback-label">
              Is this candidate a fit?
            </span>

            <div className="candidate-feedback-actions">
              <button
                type="button"
                className={`feedback-choice ${
                  feedback === "yes" ? "selected yes" : ""
                }`}
                onClick={() =>
                  onFeedbackChange(profile.id, "yes")
                }
                aria-label={`Mark ${profile.name} as a strong fit`}
              >
                <Check size={14} />
                Yes
              </button>

              <button
                type="button"
                className={`feedback-choice ${
                  feedback === "no" ? "selected no" : ""
                }`}
                onClick={() =>
                  onFeedbackChange(profile.id, "no")
                }
                aria-label={`Mark ${profile.name} as not a fit`}
              >
                <X size={14} />
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}