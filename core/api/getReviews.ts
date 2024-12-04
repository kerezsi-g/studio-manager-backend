import { api } from "encore.dev/api";
import { Review } from "../../types";
import { database } from "../../admin/db";
import { getAuthData } from "~encore/auth";

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
    auth: true,
  },

  async ({ projectId }) => {
    const { userID } = getAuthData()!;

    const results = await database.manyOrNone<Review>(SqlQuery, {
      projectId,
      userID,
    });

    return {
      data: results,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		r.user_id			as "userId"
	,			r.review_id			as "reviewId"
	,			r.project_id		as "projectId"
	,			r.t					as "t"
	,			r.content			as "content"
	,			r.file_id			as "createdFor"
	,			r.resolved_by		as "resolvedBy"
	,			r.created			as "created"
	from		v_user_projects usr
	join		t_reviews		r using ( project_id )
	where		project_id = $<projectId>
	and			usr.user_id = $<userID>
	order by	t asc
`;
