import { api } from "encore.dev/api";
import { Annotation, } from "../types";
import { database } from "../db";

interface GetAnnotationsRequest {
  assetId: string;
}

interface GetAnnotationsResponse {
  //   projectId: string;
  data: Annotation[];
}

export const getAnnotations = api<GetAnnotationsRequest, GetAnnotationsResponse>(
  {
    method: "GET",
    path: "/assets/:assetId/annotations",
    expose: true,
    // auth: true,
  },

  async ({ assetId }) => {
    const results = await database.manyOrNone<Annotation>(SqlQuery, {
		assetId,
    });

    return {
      data: results,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		annotation_id	as "annotationId"
	,			asset_id		as "assetId"
	,			t				as "t"
	,			created_for		as "createdFor"
	,			resolved_at		as "resolvedAt"
	,			created_at		as "createdAt"
	from		t_annotations
	where		asset_id = $<assetId>
	order by	t asc
`;
