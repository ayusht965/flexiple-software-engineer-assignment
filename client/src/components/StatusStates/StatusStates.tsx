import {
  AlertCircle,
  Search,
} from "lucide-react";
import "./StatusStates.css";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="error-box">
      <AlertCircle size={19} />

      <div>
        <strong>Search failed</strong>

        <p>{message}</p>

        <button onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="loading-box">
      <div className="loader" />

      <div>
        <strong>Building your candidate search</strong>

        <p>
          Understanding the requirement and evaluating
          matching profiles...
        </p>
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="empty-state">
      <Search size={24} />

      <h3>No candidates matched</h3>

      <p>
        Try relaxing one of the objective filters above.
      </p>
    </div>
  );
}