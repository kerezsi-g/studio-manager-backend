import { api } from "encore.dev/api";
import { database } from "../../admin/db";
import { Review } from "../../types";
import { getAuthData } from "~encore/auth";

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
    auth: true,
  },
  async ({ projectId, fileId, t, content }) => {
    const { userID } = getAuthData()!;

    return await database.tx(async (tx) => {
      const { exists } = await tx.one<{ exists: boolean }>(ValidationQuery, {
        projectId,
        fileId,
        userID,
      });

      if (!exists) {
        /**
         * TODO: more descriptive error message
         */
        throw new Error("Not found");
      }

      const result = await database.one<Review>(SqlQuery, {
        projectId,
        fileId,
        t,
        content,
        userID,
      });

      return {
        data: result,
      };
    });
  }
);

const ValidationQuery = /*sql*/ `
	select exists (
		select 1
		from	v_user_projects	p
		join	t_files			f using ( project_id )		
		where	project_id = $<projectId>		
		and		file_id = $<fileId>
		and		user_id = $<userID>
	)
`;

const SqlQuery = /*sql*/ `
	insert into t_reviews(
		user_id
	,	project_id
	,	t
	,	file_id
	,	content
	)
	values ($<userID>, $<projectId>, $<t>, $<fileId>, $<content>)
	returning	user_id			as "userId"
	,			review_id		as "reviewId"
	,			project_id		as "projectId"
	,			content			as "content"
	,			t				as "t"
	,			file_id			as "fileId"
	,			resolved_by		as "resolvedAt"
	,			created			as "created"
`;
