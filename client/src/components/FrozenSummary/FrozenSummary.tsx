import { Lock } from "lucide-react";
import "./FrozenSummary.css";

export function FrozenSummary() {
  return (
    <section className="frozen-summary">
      <Lock size={20} />

      <div>
        <strong>Search frozen</strong>

        <p>
          This search configuration and shortlist are now
          locked as the final sourcing result.
        </p>
      </div>
    </section>
  );
}