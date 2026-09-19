export type CompanyType =
  | "startup"
  | "scaleup"
  | "enterprise"
  | "agency";

export interface Filters {
  skills: string[];
  years_experience: {
    min: number | null;
    max: number | null;
  };
  locations: string[];
  company_types: CompanyType[];
}

export interface RubricCriterion {
  name: string;
  importance: "high" | "medium" | "low";
  description: string;
}

export interface Rubric {
  summary: string;
  criteria: RubricCriterion[];
}

export interface SearchSpec {
  filters: Filters;
  rubric: Rubric;
}

export interface PastCompany {
  company: string;
  company_type: CompanyType;
  title: string;
  years: number;
}

export interface Profile {
  id: string;
  name: string;
  current_title: string;
  years_experience: number;
  location: string;
  current_company: string;
  current_company_type: CompanyType;
  skills: string[];
  past_companies: PastCompany[];
  education: string;
  summary: string;
}