import { db } from "db";
import { generateUuidV4 } from "utils/generateUuid";
import { AssetType } from "schemas";

type Args = {
  assetName: string;
  assetType: AssetType;
};

type QueryParams = {
  assetId: string;
  assetName: string;
  assetType: AssetType;
  createdAt: number;
};

// Return the row as is
type QueryResult = QueryParams;

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_assets (asset_id, asset_name, asset_type, created_at)
	VALUES
		(@assetId, @assetName, @assetType, @createdAt)
	RETURNING
		asset_id	AS "assetId"
	,	asset_name	AS "assetName"
	,	asset_type	AS "assetType"
	,	created_at	AS "createdAt"
`);

export function CreateAsset({ assetName, assetType }: Args) {
  const bindParams: QueryParams = {
    assetId: generateUuidV4(),
    assetName,
    assetType,
    createdAt: Date.now(),
  };

  const result = sql.get(bindParams);

  return result;
}
