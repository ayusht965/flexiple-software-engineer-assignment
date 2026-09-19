import { Sparkles } from "lucide-react";

import type { SearchChange } from "../../types/search";
import "./ChangesPanel.css";

type ChangesPanelProps = {
  changes: SearchChange[];
};

export function ChangesPanel({
  changes,
}: ChangesPanelProps) {
  if (changes.length === 0) {
    return null;
  }

  return (
    <section className="changes-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} />
            Refinement applied
          </span>

          <h2>What changed</h2>
        </div>
      </div>

      <div className="changes-list">
        {changes.map((change, index) => (
          <div className="change-item" key={index}>
            <span className="change-area">
              {change.area}
            </span>

            <div>
              <strong>{change.change}</strong>
              <p>{change.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}