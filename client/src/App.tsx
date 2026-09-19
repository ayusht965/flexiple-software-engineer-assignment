import { useState } from "react";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  MessageSquare,
  Lock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./App.css";

type Filters = {
  skills: string[];
  years_experience: {
    min: number | null;
    max: number | null;
  };
  locations: string[];
  company_types: string[];
};

type Criterion = {
  name: string;
  importance: "high" | "medium" | "low";
  description: string;
};

type Rubric = {
  summary: string;
  criteria: Criterion[];
};

type SearchSpec = {
  filters: Filters;
  rubric: Rubric;
};

type Profile = {
  id: string;
  name: string;
  current_title: string;
  years_experience: number;
  location: string;
  current_company: string;
  current_company_type: string;
  skills: string[];
  past_companies: {
    company: string;
    company_type: string;
    title: string;
    years: number;
  }[];
  education: string;
  summary: string;
};

type Ranking = {
  profile_id: string;
  score: number;
  explanation: string;
  strengths: string[];
  concerns: string[];
};

const API_URL = "http://localhost:4000/api";

function App() {
  const [requirement, setRequirement] = useState("");
  const [spec, setSpec] = useState<SearchSpec | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [frozen, setFrozen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [refining, setRefining] = useState(false);

  const [changes, setChanges] = useState<
    {
      area: "filters" | "rubric";
      change: string;
      reason: string;
    }[]
  >([]);

  async function handleRefinement() {
    if (!spec || !feedback.trim()) return;

    setRefining(true);
    setError("");
    setChanges([]);

    try {
      const response = await fetch(`${API_URL}/refine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: spec.filters,
          rubric: spec.rubric,
          feedback,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to refine search."
        );
      }

      setSpec({
        filters: result.filters,
        rubric: result.rubric,
      });

      setProfiles(result.profiles);
      setRankings(result.rankings);
      setChanges(result.changes);
      setFeedback("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to refine search."
      );
    } finally {
      setRefining(false);
    }
  }

  async function handleSearch() {
    if (!requirement.trim()) return;

    setLoading(true);
    setError("");
    setSpec(null);
    setProfiles([]);
    setRankings([]);

    try {
      const parseResponse = await fetch(`${API_URL}/parse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requirement,
        }),
      });

      const parsed = await parseResponse.json();

      if (!parseResponse.ok) {
        throw new Error(parsed.error || "Failed to understand requirement.");
      }

      setSpec(parsed);

      const searchResponse = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const searchResult = await searchResponse.json();

      if (!searchResponse.ok) {
        throw new Error(searchResult.error || "Search failed.");
      }

      setProfiles(searchResult.profiles);
      setRankings(searchResult.rankings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateFilters<K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) {
    if (!spec) return;

    setSpec({
      ...spec,
      filters: {
        ...spec.filters,
        [key]: value,
      },
    });
  }

  async function rerunSearch() {
    if (!spec) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spec),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Search failed.");
      }

      setProfiles(result.profiles);
      setRankings(result.rankings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to rerun search."
      );
    } finally {
      setLoading(false);
    }
  }

  const rankingMap = new Map(
    rankings.map((ranking) => [ranking.profile_id, ranking])
  );

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">Sourcing Refinement Loop</div>
          <div className="subtitle">
            AI-assisted candidate sourcing
          </div>
        </div>

        {spec && (
          <button
            className="freeze-button"
            onClick={() => setFrozen(true)}
            disabled={frozen}
          >
            <Lock size={16} />
            {frozen ? "Search frozen" : "Freeze search"}
          </button>
        )}
      </header>

      <main className="container">
        {!spec && !loading && !error && (
          <section className="hero">
            <div className="hero-icon">
              <Sparkles size={24} />
            </div>

            <h1>Find the right candidates</h1>

            <p>
              Describe the role in plain language. The AI will turn it
              into editable search criteria and rank matching profiles.
            </p>
          </section>
        )}

        <section className="search-box">
          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
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
              onClick={handleSearch}
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

        {error && (
          <div className="error-box">
            <AlertCircle size={19} />
            <div>
              <strong>Search failed</strong>
              <p>{error}</p>
              <button onClick={handleSearch}>Try again</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-box">
            <div className="loader" />
            <div>
              <strong>Building your candidate search</strong>
              <p>
                Understanding the requirement and evaluating matching
                profiles...
              </p>
            </div>
          </div>
        )}

        {spec && !loading && (
          <>
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
                  onClick={rerunSearch}
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
                    value={spec.filters.skills.join(", ")}
                    onChange={(e) =>
                      updateFilters(
                        "skills",
                        e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean)
                      )
                    }
                    disabled={frozen}
                  />
                </label>

                <label>
                  <span>Locations</span>
                  <input
                    value={spec.filters.locations.join(", ")}
                    onChange={(e) =>
                      updateFilters(
                        "locations",
                        e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean)
                      )
                    }
                    disabled={frozen}
                  />
                </label>

                <label>
                  <span>Min experience</span>
                  <input
                    type="number"
                    value={spec.filters.years_experience.min ?? ""}
                    onChange={(e) =>
                      updateFilters("years_experience", {
                        ...spec.filters.years_experience,
                        min: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    disabled={frozen}
                  />
                </label>

                <label>
                  <span>Max experience</span>
                  <input
                    type="number"
                    value={spec.filters.years_experience.max ?? ""}
                    onChange={(e) =>
                      updateFilters("years_experience", {
                        ...spec.filters.years_experience,
                        max: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    disabled={frozen}
                  />
                </label>
              </div>
            </section>

            <section className="section rubric-section">
              <span className="eyebrow">
                <Sparkles size={14} />
                AI fit rubric
              </span>

              <h2>What makes a strong candidate</h2>

              <p className="rubric-summary">
                {spec.rubric.summary}
              </p>

              <div className="criteria">
                {spec.rubric.criteria.map((criterion) => (
                  <div className="criterion" key={criterion.name}>
                    <div className="criterion-top">
                      <strong>{criterion.name}</strong>
                      <span className={`importance ${criterion.importance}`}>
                        {criterion.importance}
                      </span>
                    </div>
                    <p>{criterion.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="section">
              <div className="section-header">
                <div>
                  <span className="eyebrow">Ranked shortlist</span>
                  <h2>
                    {rankings.length
                      ? `Top ${rankings.length} candidates`
                      : "No matching candidates"}
                  </h2>
                </div>

                <span className="match-count">
                  {profiles.length} profile
                  {profiles.length === 1 ? "" : "s"} matched filters
                </span>
              </div>

              {rankings.length === 0 ? (
                <div className="empty-state">
                  <Search size={24} />
                  <h3>No candidates matched</h3>
                  <p>
                    Try relaxing one of the objective filters above.
                  </p>
                </div>
              ) : (
                <div className="candidate-list">
                  {rankings.map((ranking, index) => {
                    const profile = profiles.find(
                      (p) => p.id === ranking.profile_id
                    );

                    if (!profile) return null;

                    return (
                      <article className="candidate-card" key={profile.id}>
                        <div className="rank">{index + 1}</div>

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
                            <span>
                              {profile.current_company_type}
                            </span>
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
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="feedback-panel">
              <div className="feedback-heading">
                <div className="feedback-icon">
                  <MessageSquare size={20} />
                </div>

                <div>
                  <strong>Refine the shortlist</strong>
                  <p>
                    Tell the AI what you liked or disliked about these
                    candidates.
                  </p>
                </div>
              </div>

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder='Example: "1 is too junior. I want stronger startup experience and at least 5 years."'
                disabled={frozen || refining}
              />

              <div className="feedback-footer">
                <span>
                  The AI will explain what it changed before reranking.
                </span>

                <button
                  onClick={handleRefinement}
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
            {changes.length > 0 && (
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
            )}
          </>
        )}

        {frozen && (
          <section className="frozen-summary">
            <Lock size={20} />
            <div>
              <strong>Search frozen</strong>
              <p>
                This search configuration and shortlist are now locked
                as the final sourcing result.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;