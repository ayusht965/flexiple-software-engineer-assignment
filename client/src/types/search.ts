export type Filters = {
  skills: string[];
  years_experience: {
    min: number | null;
    max: number | null;
  };
  locations: string[];
  company_types: string[];
};

export type Criterion = {
  name: string;
  importance: "high" | "medium" | "low";
  description: string;
};

export type Rubric = {
  summary: string;
  criteria: Criterion[];
};

export type SearchSpec = {
  filters: Filters;
  rubric: Rubric;
};

export type Profile = {
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

export type Ranking = {
  profile_id: string;
  score: number;
  explanation: string;
  strengths: string[];
  concerns: string[];
};

export type SearchChange = {
  area: "filters" | "rubric";
  change: string;
  reason: string;
};