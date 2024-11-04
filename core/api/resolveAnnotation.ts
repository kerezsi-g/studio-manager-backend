import { api } from "encore.dev/api";
import { database } from "../db";
import { Annotation } from "../types";

interface ResolveAnnotationRequest {
  itemId: string;
}

interface ResolveAnnotationResponse {
  data: Annotation;
}

export const resolveAnnotation = api<ResolveAnnotationRequest, ResolveAnnotationResponse>(
  {
    method: "PATCH",
    path: "/items/:itemId/annotations",
    expose: true,
    auth: false,
  },
  async ({ itemId }) => {
    const result = await database.one<Annotation>(SqlQuery, { itemId });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	update	t_annotations
	set		resolved_at = $<fileId>
	where	annotation_id = $<annotationId>
	and		resolved_at is null
	returning	annotation_id	as "annotationId"
	,			item_id			as "itemId"
	,			t				as "t"
	,			created_for		as "createdFor"
	,			resolved_at		as "resolvedAt"
	,			created_at		as "createdAt"
`;
