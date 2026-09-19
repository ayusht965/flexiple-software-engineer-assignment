import { useState } from "react";
import "./App.css";

import { Header } from "./components/Header/Header";
import { SearchBox } from "./components/SearchBox/SearchBox";
import { SearchFilters } from "./components/SearchFilters/SearchFilters";
import { FitRubric } from "./components/FitRubric/FitRubric";
import { CandidateCard } from "./components/CandidateCard/CandidateCard";
import { FeedbackPanel } from "./components/FeedbackPanel/FeedbackPanel";
import { ChangesPanel } from "./components/ChangesPanel/ChangesPanel";
import { FrozenSummary } from "./components/FrozenSummary/FrozenSummary";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "./components/StatusStates/StatusStates";

import type {
  Filters,
  Profile,
  Ranking,
  SearchChange,
  SearchSpec,
} from "./types/search";

const API_URL = "http://localhost:4000/api";

function App() {
  const [requirement, setRequirement] = useState("");
  const [spec, setSpec] = useState<SearchSpec | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);

  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);

  const [error, setError] = useState("");
  const [frozen, setFrozen] = useState(false);

  const [feedback, setFeedback] = useState("");

  const [changes, setChanges] = useState<SearchChange[]>([]);

  const [profileFeedback, setProfileFeedback] = useState<
    Record<string, "yes" | "no">
  >({});

  async function handleSearch() {
    if (!requirement.trim()) return;

    setLoading(true);
    setError("");
    setSpec(null);
    setProfiles([]);
    setRankings([]);
    setChanges([]);
    setProfileFeedback({});
    setFrozen(false);

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
      console.log("AI PARSED SEARCH:", parsed);

      if (!parseResponse.ok) {
        throw new Error(
          parsed.error || "Failed to understand requirement."
        );
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
      console.log("SEARCH RESULT:", searchResult);

      if (!searchResponse.ok) {
        throw new Error(
          searchResult.error || "Search failed."
        );
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

  async function handleRefinement() {
    if (!spec || !feedback.trim()) return;

    setRefining(true);
    setError("");
    setChanges([]);

    const candidateFeedback = Object.entries(profileFeedback)
      .map(([profileId, value]) => {
        const profile = profiles.find(
          (candidate) => candidate.id === profileId
        );

        const rankIndex = rankings.findIndex(
          (ranking) => ranking.profile_id === profileId
        );

        if (!profile || rankIndex === -1) {
          return "";
        }

        const rank = rankIndex + 1;

        return `Candidate ${rank} (${profile.name}) was marked ${value === "yes" ? "a strong fit" : "not a fit"
          } by the recruiter.`;
      })
      .filter(Boolean)
      .join("\n");
    const combinedFeedback = [
      feedback.trim(),
      candidateFeedback,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch(`${API_URL}/refine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: spec.filters,
          rubric: spec.rubric,
          feedback: combinedFeedback,
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
      setFeedback("");
      setProfileFeedback({});
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

  function updateRubric(
    rubric: SearchSpec["rubric"]
  ) {
    if (!spec) return;

    setSpec({
      ...spec,
      rubric,
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
        throw new Error(
          result.error || "Search failed."
        );
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

  return (
    <div className="app">
      <Header
        hasSearch={Boolean(spec)}
        frozen={frozen}
        onFreeze={() => setFrozen(true)}
      />

      <main className="container">
        {!spec && !loading && !error && (
          <section className="hero">
            <div className="hero-icon">
              <span>✦</span>
            </div>

            <h1>Find the right candidates</h1>

            <p>
              Describe the role in plain language. The AI
              will turn it into editable search criteria and
              rank matching profiles.
            </p>
          </section>
        )}

        <SearchBox
          requirement={requirement}
          loading={loading}
          frozen={frozen}
          onRequirementChange={setRequirement}
          onSearch={handleSearch}
        />

        {error && (
          <ErrorState
            message={error}
            onRetry={handleSearch}
          />
        )}

        {loading && <LoadingState />}

        {spec && !loading && (
          <>
            <SearchFilters
              filters={spec.filters}
              frozen={frozen}
              onUpdate={updateFilters}
              onApply={rerunSearch}
            />

            <FitRubric
              rubric={spec.rubric}
              frozen={frozen}
              onChange={updateRubric}
            />

            <section className="section">
              <div className="section-header">
                <div>
                  <span className="eyebrow">
                    Ranked shortlist
                  </span>

                  <h2>
                    {rankings.length
                      ? `Top ${rankings.length} candidates`
                      : "No matching candidates"}
                  </h2>
                </div>

                <span className="match-count">
                  {profiles.length} profile
                  {profiles.length === 1 ? "" : "s"} matched
                  filters
                </span>
              </div>

              {rankings.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="candidate-list">
                  {rankings.map((ranking, index) => {
                    const profile = profiles.find(
                      (candidate) =>
                        candidate.id === ranking.profile_id
                    );

                    if (!profile) return null;

                    return (
                      <CandidateCard
                        key={profile.id}
                        profile={profile}
                        ranking={ranking}
                        rank={index + 1}
                        feedback={profileFeedback[profile.id]}
                        onFeedbackChange={(profileId, value) => {
                          setProfileFeedback((current) => ({
                            ...current,
                            [profileId]: value,
                          }));
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            <FeedbackPanel
              feedback={feedback}
              frozen={frozen}
              refining={refining}
              onFeedbackChange={setFeedback}
              onRefine={handleRefinement}
            />

            <ChangesPanel changes={changes} />
          </>
        )}

        {frozen && <FrozenSummary />}
      </main>
    </div>
  );
}

export default App;