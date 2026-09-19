import {
  MessageSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import "./FeedbackPanel.css";

type FeedbackPanelProps = {
  feedback: string;
  frozen: boolean;
  refining: boolean;
  onFeedbackChange: (value: string) => void;
  onRefine: () => void;
};

export function FeedbackPanel({
  feedback,
  frozen,
  refining,
  onFeedbackChange,
  onRefine,
}: FeedbackPanelProps) {
  return (
    <section className="feedback-panel">
      <div className="feedback-heading">
        <div className="feedback-icon">
          <MessageSquare size={20} />
        </div>

        <div>
          <strong>Refine the shortlist</strong>

          <p>
            Tell the AI what you liked or disliked about
            these candidates.
          </p>
        </div>
      </div>

      <textarea
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        placeholder='Example: "1 is too junior. I want stronger startup experience and at least 5 years."'
        disabled={frozen || refining}
      />

      <div className="feedback-footer">
        <span>
          The AI will explain what it changed before
          reranking.
        </span>

        <button
          onClick={onRefine}
          disabled={!feedback.trim() || frozen || refining}
        >
          {refining ? (
            <>
              <RefreshCw className="spin" size={16} />
              Refining...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Refine search
            </>
          )}
        </button>
      </div>
    </section>
  );
}