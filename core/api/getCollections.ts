import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { Collection } from "../../types";
import { database } from "../../admin/db";

interface GetCollectionsResponse {
  data: Collection[];
}

export const getCollections = api<void, GetCollectionsResponse>(
  {
    method: "GET",
    path: "/collections",
    expose: true,
    auth: true,
  },
  async () => {
    const { userID } = getAuthData()!;

    const result = await database.manyOrNone<Collection>(SqlQuery, { userID });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		c.collection_id			as "collectionId"
	,			c.collection_name		as "collectionName"
	,			c.created				as "created"
	,			count(p.project_id)		as "projectCount"
	from		t_collections			c	
	join		t_collection_members 	cm	using ( collection_id )
	left join	t_projects				p	using ( collection_id )	
	where		user_id = $<userID>
	group by	c.collection_id
	order by	c.collection_name asc	
`;
