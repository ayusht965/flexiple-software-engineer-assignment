import {
  RefreshCw,
  Search,
} from "lucide-react";
import "./SearchBox.css";

type SearchBoxProps = {
  requirement: string;
  loading: boolean;
  frozen: boolean;
  onRequirementChange: (value: string) => void;
  onSearch: () => void;
};

export function SearchBox({
  requirement,
  loading,
  frozen,
  onRequirementChange,
  onSearch,
}: SearchBoxProps) {
  return (
    <section className="search-box">
      <textarea
        value={requirement}
        onChange={(e) => onRequirementChange(e.target.value)}
        placeholder="Example: I need a backend engineer in Bangalore with 4–7 years of experience, strong Node.js and PostgreSQL skills, preferably someone who has worked at startups."
        disabled={loading || frozen}
      />

      <div className="search-footer">
        <span>
          {requirement.length > 0
            ? `${requirement.length} characters`
            : "Describe your hiring requirement"}
        </span>

        <button
          onClick={onSearch}
          disabled={!requirement.trim() || loading || frozen}
        >
          {loading ? (
            <>
              <RefreshCw className="spin" size={17} />
              Searching...
            </>
          ) : (
            <>
              <Search size={17} />
              Find candidates
            </>
          )}
        </button>
      </div>
    </section>
  );
}