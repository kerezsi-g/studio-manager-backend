import { api } from "encore.dev/api";
import { database } from "../../admin/db";
import { Review } from "../types";
import { getAuthData } from "~encore/auth";

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
    auth: true,
  },
  async ({ reviewId, fileId }) => {
    const { userID } = getAuthData()!;

    const result = await database.one<Review>(SqlQuery, {
      reviewId,
      fileId,
      userID,
    });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	update		t_reviews
	set			resolved_at = $<fileId>
	where		review_id = $<reviewId>
	and			review_id = $<userID>
	and			resolved_at is null
	returning	review_id		as "reviewId"
	,			project_id			as "projectId"
	,			t				as "t"
	,			file_id			as "fileId"
	,			resolved_by		as "resolvedAt"
	,			created_at		as "createdAt"
`;
