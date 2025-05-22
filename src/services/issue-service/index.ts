import { ProjectsService } from "services/projects-service";
import * as Queries from "./queries";
import { Issue } from "schemas/Issue.type";

//Directly exposes the underlying queries, as there is no additional logic yet
export namespace IssueService {
  type CreateIssueArgs = Omit<Issue, "issueId" | "createdAt" | "resolvedAt">;

  export function createIssue({
    userId,
    projectId,
    description,
    timestamp = null,
    duration = null,
    fileId,
  }: CreateIssueArgs) {
    ProjectsService.validateAccess({ userId, projectId });

    const result = Queries.CreateIssue({
      userId,
      projectId,
      description,
      timestamp,
      duration,
      fileId,
    });

    return result;
  }

  type ResolveIssueArgs = Pick<Issue, "userId" | "issueId">;

  export function resolveIssue({ userId, issueId }: ResolveIssueArgs) {
    Queries.ResolveIssue({ userId, issueId });
  }
}
