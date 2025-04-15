import { ProjectDetails } from "schemas/ProjectDetails.type";
import { ProjectMedia } from "schemas/ProjectMedia.type";
import { Project } from "schemas/Project.type";
import { UserData } from "schemas/UserData.type";

import * as Queries from "./queries";

export namespace ProjectsService {
  interface ProjectMember {
    userId: string;
    projectId: string;
  }

  export function validateAccess({ userId, projectId }: ProjectMember) {
    /**
     * TODO: Implement
     */
  }

  export function createProject({ projectName, projectType }: Queries.CreateProjectArgs) {
    const result = Queries.CreateProject({ projectName, projectType });

    if (!result) {
      throw new Error("Failed to create project");
    }

    return result;
  }

  export function updateProject({ projectId, projectName }: Queries.UpdateProjectArgs) {
    const result = Queries.UpdateProject({ projectId, projectName });

    if (!result) {
      throw new Error("Failed to update project");
    }

    return result;
  }

  export function getProjectsByUserId(userId: string): Project[] {
    const results = Queries.GetUserProjects(userId);

    return results;
  }

  export function getProjectDetails({ userId, projectId }: ProjectMember): ProjectDetails {
    validateAccess({ userId, projectId });

    const project = Queries.GetProjectById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const files = Queries.GetProjectFiles(projectId);
    const issues = Queries.GetProjectIssues(projectId);

    return {
      projectId,
      projectName: project.projectName,
      projectType: project.projectType,
      createdAt: project.createdAt,
      files,
      issues,
    };
  }

  export function getProjectMembers(projectId: string): UserData[] {
    const results = Queries.GetProjectMembers(projectId);

    return results;
  }

  export function addProjectMember({ userId, projectId }: ProjectMember) {
    const result = Queries.AddProjectMember({ projectId, userId });

    if (!result) {
      throw new Error("Failed to add member");
    }

    return result;
  }

  export function removeProjectMember({ userId, projectId }: ProjectMember) {
    Queries.RemoveProjectMember({ projectId, userId });
    // Nothing else to do here
  }

  interface LinkFileToProjectArgs {
    projectId: string;
    sha256: string;
    tag: string;
    path?: string;
    fileName: string;
  }

  export function getProjectFiles(projectId: string): ProjectMedia[] {
    const results = Queries.GetProjectFiles(projectId);

    return results;
  }

  export function linkFileToProject({
    projectId,
    sha256,
    tag,
    path,
    fileName,
  }: LinkFileToProjectArgs) {
    const result = Queries.LinkFileToProject({ projectId, sha256, tag, path, fileName });

    if (!result) {
      throw new Error("Failed to link file to project");
    }

    return result;
  }

  export function unlinkFileFromProject({
    projectId,
    sha256,
    tag,
  }: Omit<LinkFileToProjectArgs, "path" | "fileName">) {
    // Nothing else to do here
    Queries.UnlinkFileFromProject({ projectId, sha256, tag });
  }
}
