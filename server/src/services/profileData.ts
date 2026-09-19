import profiles from "../data/profiles.json";
import { Profile } from "../types";

export function getProfiles(): Profile[] {
  return profiles as Profile[];
}