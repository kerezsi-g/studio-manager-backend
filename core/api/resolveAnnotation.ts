import { api } from "encore.dev/api";
import { database } from "../db";
import { Review } from "../types";

interface ResolveReviewRequest {
  reviewId: string;
  fileId: string;
}

interface ResolveReviewResponse {
  data: Review;
}

export const resolveReview = api<ResolveReviewRequest, ResolveReviewResponse>(
  {
    method: "PATCH",
    path: "/reviews/:reviewId",
    expose: true,
    auth: false,
  },
  async ({ reviewId, fileId }) => {
    const result = await database.one<Review>(SqlQuery, { reviewId, fileId });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	update	t_reviews
	set		resolved_at = $<fileId>
	where	review_id = $<reviewId>
	and		resolved_at is null
	returning	review_id		as "reviewId"
	,			project_id			as "projectId"
	,			t				as "t"
	,			file_id			as "fileId"
	,			resolved_by		as "resolvedAt"
	,			created_at		as "createdAt"
`;
