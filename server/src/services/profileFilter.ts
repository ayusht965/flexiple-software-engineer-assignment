import { Filters } from "../types";
import { Profile } from "../types";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeSkill(skill: string): string {
  const value = normalize(skill);

  const aliases: Record<string, string> = {
    node: "node.js",
    nodejs: "node.js",
    postgres: "postgresql",
    postgresql: "postgresql",
    reactjs: "react",
    react: "react",
    typescript: "typescript",
  };

  return aliases[value] ?? value;
}

function skillMatches(
  profileSkills: string[],
  requestedSkill: string
): boolean {
  const requested = normalizeSkill(requestedSkill);

  return profileSkills.some(
    (skill) => normalizeSkill(skill) === requested
  );
}

function locationMatches(
  profileLocation: string,
  requestedLocation: string
): boolean {
  const profile = normalize(profileLocation);
  const requested = normalize(requestedLocation);

  const aliases: Record<string, string> = {
    bangalore: "bengaluru",
    bengaluru: "bengaluru",
    bombay: "mumbai",
    mumbai: "mumbai",
    delhi: "delhi",
    gurgaon: "gurugram",
    gurugram: "gurugram",
  };

  return (
    (aliases[profile] ?? profile) ===
    (aliases[requested] ?? requested)
  );
}

function companyTypeMatches(
  profile: Profile,
  requestedType: string
): boolean {
  const requested = normalize(requestedType);

  if (normalize(profile.current_company_type) === requested) {
    return true;
  }

  return profile.past_companies.some(
    (company) => normalize(company.company_type) === requested
  );
}

export function filterProfiles(
  profiles: Profile[],
  filters: Filters
): Profile[] {
  return profiles.filter((profile) => {
    // Years of experience
    if (
      filters.years_experience.min !== null &&
      profile.years_experience < filters.years_experience.min
    ) {
      return false;
    }

    if (
      filters.years_experience.max !== null &&
      profile.years_experience > filters.years_experience.max
    ) {
      return false;
    }

    // Skills - candidate must have ALL requested skills
    if (filters.skills.length > 0) {
      const hasAllSkills = filters.skills.every((skill) =>
        skillMatches(profile.skills, skill)
      );

      if (!hasAllSkills) {
        return false;
      }
    }

    // Location
    if (filters.locations.length > 0) {
      const matchesLocation = filters.locations.some((location) =>
        locationMatches(profile.location, location)
      );

      if (!matchesLocation) {
        return false;
      }
    }

    // Company type
    if (filters.company_types.length > 0) {
      const matchesCompanyType = filters.company_types.some((type) =>
        companyTypeMatches(profile, type)
      );

      if (!matchesCompanyType) {
        return false;
      }
    }

    return true;
  });
}