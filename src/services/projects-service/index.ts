import { ProjectDetails } from "schemas/ProjectDetails.type";
import { ProjectAsset } from "schemas/ProjectAsset";
import { Project } from "schemas/Project.type";
import { UserData } from "schemas/UserData.type";

import * as Queries from "./queries";
import { FileGenerationService } from "services/file-generation-service";
import { FileService } from "services/file-service";
import { ProjectAssetSelector } from "./queries/AddAssetToProject";

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

  export function createProject({ projectName, projectType, subject }: Queries.CreateProjectArgs) {
    const result = Queries.CreateProject({ projectName, projectType, subject });

    if (!result) {
      throw new Error("Failed to create project");
    }

    return result;
  }

  export function updateProject({ projectId, projectName, subject }: Queries.UpdateProjectArgs) {
    const result = Queries.UpdateProject({ projectId, projectName, subject });

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

    const assets = Queries.GetProjectAssets(projectId);
    const issues = Queries.GetProjectIssues(projectId);

    return {
      projectId,
      projectName: project.projectName,
      projectType: project.projectType,
      createdAt: project.createdAt,
      subject: project.subject,
      assets,
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
    fileName?: string;
  }

  export function getProjectFiles(projectId: string): ProjectAsset[] {
    const results = Queries.GetProjectAssets(projectId);

    return results;
  }

  export function addAssetToProject({ projectId, assetId, tag }: ProjectAssetSelector) {
    const result = Queries.AddAssetToProject({ projectId, assetId, tag });

    if (!result) {
      throw new Error("Failed to add asset to project");
    }

    return result;
  }

  export function removeAssetFromProject({ projectId, assetId, tag }: ProjectAssetSelector) {
    const result = Queries.RemoveAssetFromProject({ projectId, assetId, tag });

    if (!result) {
      throw new Error("Failed to remove asset from project");
    }

    return result;
  }

  /** @deprecated */
  export function linkFileToProject({
    projectId,
    sha256,
    tag,
    path,
    fileName,
  }: LinkFileToProjectArgs) {
    throw "Not implemented";
  }

  /** @deprecated */
  export function unlinkFileFromProject({
    projectId,
    sha256,
    tag,
  }: Omit<LinkFileToProjectArgs, "path" | "fileName">) {    
    Queries.UnlinkFileFromProject({ projectId, sha256, tag });
  }
}
