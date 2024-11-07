import { api } from "encore.dev/api";
import { database } from "../db";
import { Review } from "../types";

interface CreateReviewRequest {
  projectId: string;
  fileId: string;
  t: number;
  content: string;
}

interface CreateReviewResponse {
  data: Review;
}

export const createReview = api<CreateReviewRequest, CreateReviewResponse>(
  {
    method: "POST",
    path: "/projects/:projectId/reviews",
    expose: true,
    auth: false,
  },
  async ({ projectId, fileId, t, content }) => {
    const result = await database.one<Review>(SqlQuery, {
      projectId,
      fileId,
      t,
      content,
    });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	insert into t_reviews(		
		project_id
	,	t
	,	file_id
	,	content
	)
	values ($<projectId>, $<t>, $<fileId>, $<content>)
	returning	review_id		as "reviewId"
	,			project_id		as "projectId"
	,			content			as "content"
	,			t				as "t"
	,			file_id			as "fileId"
	,			resolved_by		as "resolvedAt"
	,			created_at		as "createdAt"
`;