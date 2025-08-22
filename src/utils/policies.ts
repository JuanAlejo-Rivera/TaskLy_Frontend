import type { Project, TeamMember } from "../types";

export const isManager = (managerId: Project['manager'], UserId: TeamMember['_id']) => managerId === UserId

