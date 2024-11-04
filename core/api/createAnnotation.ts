import { api } from "encore.dev/api";
import { database } from "../db";
import { Annotation } from "../types";

interface CreateAnnotationRequest {
  itemId: string;
}

interface CreateAnnotationResponse {
  data: Annotation;
}

export const createAnnotation = api<CreateAnnotationRequest, CreateAnnotationResponse>(
  {
    method: "POST",
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
	insert into t_annotations(		
		item_id
	,	t
	,	created_for
	)
	values ($<itemId>, $<t>, $<createdFor>)
	returning	annotation_id	as "annotationId"
	,			item_id			as "itemId"
	,			t				as "t"
	,			created_for		as "createdFor"
	,			resolved_at		as "resolvedAt"
	,			created_at		as "createdAt"
`;
