import { Collection } from "schemas/Collection.type";
import * as Queries from "./queries";

export namespace CollectionsService {
  interface Selector {
    collectionId: string;
    projectId: string;
  }

  export function createCollection(collectionName: string) {
    const result = Queries.CreateCollection({ collectionName });
  }

  export function updateCollection(collectionId: string, collectionName: string) {
    const result = Queries.UpdateCollection({ collectionId, collectionName });
  }

  export function deleteCollection(collectionId: string) {
    throw new Error("Not implemented");
  }

  export function getUserCollections(userId: string): Collection[] {
    const collections = Queries.GetUserCollections({ userId });

    return collections;
  }

  export function addProjectToCollection({ collectionId, projectId }: Selector) {
    const result = Queries.AddProjectToCollection({ collectionId, projectId });
  }

  export function removeProjectFromCollection({ collectionId, projectId }: Selector) {
    const result = Queries.RemoveProjectFromCollection({ collectionId, projectId });
  }
}
