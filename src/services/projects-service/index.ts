import { ProjectDetails } from "schemas/ProjectDetails.type";
import { ProjectAsset } from "schemas/ProjectAsset";
import { Project } from "schemas/Project.type";
import { UserData } from "schemas/UserData.type";

import * as Queries from "./queries";
import { AssetTag, AssetType } from "schemas";

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

    const assets = Queries.GetAssets(projectId);
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

  interface AssetId {
    projectId: string;
    fileId: string;
    assetType: AssetType;
  }

  export function getAssets(projectId: string): ProjectAsset[] {
    const results = Queries.GetAssets(projectId);

    return results;
  }

  export function createAsset(asset: AssetId) {
    if (asset.assetType == AssetType.BackgroundImage || asset.assetType == AssetType.Thumbnail) {
      const assetsToDelete = getAssetsByType(asset.projectId, asset.assetType);

      for (const asset of assetsToDelete) {
        deleteAsset(asset);
      }
    }

    return Queries.CreateAsset(asset);
  }

  export function deleteAsset(assetId: AssetId) {
    Queries.DeleteAsset(assetId);
  }

  export function getAssetsByType(projectId: string, assetType: AssetType): ProjectAsset[] {
    const results = Queries.GetAssetsByType({ projectId, assetType });

    return results;
  }

  export function tagAsset({ projectId, fileId, assetType }: AssetId, tag: AssetTag) {
    if (assetType != AssetType.Primary) {
      throw new Error("Only primary assets can be tagged");
    }

    Queries.SetAssetTag({ projectId, fileId, tag });
  }
}
