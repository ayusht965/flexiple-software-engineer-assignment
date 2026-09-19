import { Lock } from "lucide-react";
import "./Header.css";

type HeaderProps = {
  hasSearch: boolean;
  frozen: boolean;
  onFreeze: () => void;
};

export function Header({
  hasSearch,
  frozen,
  onFreeze,
}: HeaderProps) {
  return (
    <header className="topbar">
      <div>
        <div className="brand">Sourcing Refinement Loop</div>
        <div className="subtitle">
          AI-assisted candidate sourcing
        </div>
      </div>

      {hasSearch && (
        <button
          className="freeze-button"
          onClick={onFreeze}
          disabled={frozen}
        >
          <Lock size={16} />
          {frozen ? "Search frozen" : "Freeze search"}
        </button>
      )}
    </header>
  );
}