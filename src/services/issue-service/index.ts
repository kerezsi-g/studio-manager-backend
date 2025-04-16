import { ProjectsService } from "services/projects-service";
import { CreateIssue, ResolveIssue } from "./queries";
import { Issue } from "schemas/Issue.type";

//Directly exposes the underlying queries, as there is no additional logic yet
export namespace IssueService {
  type CreateIssueArgs = Omit<Issue, "issueId" | "createdAt" | "resolvedAt"> & {
    projectId: string;
  };

  export function createIssue({
    userId,
    projectId,
    description,
    timestamp,
    duration,
  }: CreateIssueArgs) {
    ProjectsService.validateAccess({ userId, projectId });
    const result = CreateIssue({ userId, projectId, description, timestamp, duration });

    return result;
  }

  type ResolveIssueArgs = Pick<Issue, "userId" | "issueId"> & { projectId: string };

  export function resolveIssue({ userId, projectId, issueId }: ResolveIssueArgs) {
    ProjectsService.validateAccess({ userId, projectId });

    ResolveIssue({ userId, projectId, issueId });
  }
}
