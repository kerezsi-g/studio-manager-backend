import { api } from "encore.dev/api";
import { Review, } from "../types";
import { database } from "../db";

interface GetReviewsRequest {
  projectId: string;
}

interface GetReviewsResponse {
  //   collectionId: string;
  data: Review[];
}

export const getReviews = api<GetReviewsRequest, GetReviewsResponse>(
  {
    method: "GET",
    path: "/projects/:projectId/reviews",
    expose: true,
    // auth: true,
  },

  async ({ projectId }) => {
    const results = await database.manyOrNone<Review>(SqlQuery, {
		projectId,
    });

    return {
      data: results,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		review_id		as "reviewId"
	,			project_id		as "projectId"
	,			t				as "t"
	,			content			as "content"
	,			file_id			as "createdFor"
	,			resolved_by		as "resolvedBy"
	,			created			as "created"
	from		t_reviews
	where		project_id = $<projectId>
	order by	t asc
`;
