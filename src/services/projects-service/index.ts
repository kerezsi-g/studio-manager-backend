import { GetProjectById } from "queries/GetProjectById";
import { GetProjectFiles } from "queries/GetProjectFiles";
import { GetProjectIssues } from "queries/GetProjectIssues";
import { Collection } from "schemas/Collection.type";
import { Issue } from "schemas/Issue.type";
import { ProjectDetails } from "schemas/ProjectDetails.type";
import { ProjectMedia } from "schemas/ProjectMedia.type";

export namespace ProjectsService {
  export function getProjectDetails(userId: string, projectId: string): ProjectDetails {
    const project = GetProjectById({ userId, projectId });

    const files = GetProjectFiles({ projectId });
    const issues = GetProjectIssues({ projectId });

    return {
      projectId,
      projectName: project.projectName,
      projectType: project.projectType,
      createdAt: project.createdAt,
      files,
      issues,
    };
  }
}
