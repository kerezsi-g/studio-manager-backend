/**
 * Users and authentication
 */
CREATE TABLE IF NOT EXISTS t_users(
	user_id			TEXT	NOT NULL
,	email			TEXT	NOT NULL
,	password		TEXT	NOT NULL
,	name			TEXT
,	created_at		INTEGER --unix timestamp
,	PRIMARY KEY (user_id)
,	UNIQUE (email)
);


CREATE TABLE IF NOT EXISTS t_login_history(
	user_id		TEXT NOT NULL
,	t			INTEGER	NOT NULL --unix timestamp
,	PRIMARY KEY (user_id, t)
,	FOREIGN KEY (user_id) REFERENCES t_users(user_id)
);


/**
 * Dictionaries
 */
-- CREATE TABLE IF NOT EXISTS t_project_types(
-- 	project_type_id	TEXT NOT NULL
-- ,	PRIMARY KEY (project_type_id)
-- );


-- INSERT INTO
-- 	t_project_types(project_type_id)
-- VALUES
-- 	('audio'),
-- 	('video'),
-- 	('image');


-- CREATE TABLE IF NOT EXISTS t_tags(
-- 	project_type_id	TEXT NOT NULL
-- ,	tag				TEXT NOT NULL
-- ,	PRIMARY KEY (project_type_id, tag)
-- ,	FOREIGN KEY (project_type_id) REFERENCES t_project_types(project_type_id)
-- );

-- Audio project
-- INSERT INTO t_project_types (project_type_id) VALUES ('audio');
-- INSERT INTO t_tags (project_type_id, tag) VALUES ('audio', 'delivery');
-- INSERT INTO t_tags (project_type_id, tag) VALUES ('audio', 'bts');

-- Video project
-- INSERT INTO t_project_types (project_type_id) VALUES ('video');
-- INSERT INTO t_tags (project_type_id, tag) VALUES ('video', 'delivery');
-- INSERT INTO t_tags (project_type_id, tag) VALUES ('video', 'bts');


-- Image gallery project
-- INSERT INTO t_project_types (project_type_id) VALUES ('photography');
-- INSERT INTO t_tags (project_type_id, tag) VALUES ('photography', 'unflagged');
-- INSERT INTO t_tags (project_type_id, tag) VALUES ('photography', 'accepted');
-- INSERT INTO t_tags (project_type_id, tag) VALUES ('photography', 'rejected');
-- INSERT INTO t_tags (project_type_id, tag) VALUES ('photography', 'bts');



/**
 * Core objects
 */
CREATE TABLE IF NOT EXISTS t_projects(
	project_id		TEXT	NOT NULL
,	project_name	TEXT	NOT NULL
,	project_type	TEXT	NOT NULL
,	subject			TEXT	NOT NULL
,	created_at		INTEGER --unix timestamp
,	PRIMARY KEY (project_id)
-- ,	FOREIGN KEY (project_type)
-- 		REFERENCES t_project_types(project_type_id)
);

CREATE TABLE IF NOT EXISTS t_project_members(
	project_id		TEXT	NOT NULL
,	user_id			TEXT	NOT NULL
,	added_at		INTEGER	NOT NULL --unix timestamp
,	PRIMARY KEY (project_id, user_id)
,	FOREIGN KEY (project_id)
		REFERENCES t_projects(project_id)
		ON DELETE CASCADE
,	FOREIGN KEY (user_id)
		REFERENCES t_users(user_id)
		ON DELETE CASCADE
);


-- DEPRECATED
CREATE TABLE IF NOT EXISTS t_files(
	sha256			TEXT	NOT NULL --sha256 hash of file
,	file_name		TEXT	NOT NULL --original filename at time of upload
,	content_type	TEXT	NOT NULL --mime type
,	size			INTEGER
,	created_at		INTEGER	NOT NULL --unix timestamp
,	uploaded_at		INTEGER	NOT NULL --unix timestamp
,	PRIMARY KEY (sha256)
);

CREATE TABLE IF NOT EXISTS t_project_files(
	project_id		TEXT	NOT NULL
,	sha256			TEXT	NOT NULL
,	tag				TEXT	NOT NULL --primary deliverable, supplementary media, hidden, source file, etc...
,	file_name		TEXT
,	path			TEXT			 --potentially usable to create a virtual folder structure for a project
,	added_at		INTEGER NOT NULL --unix timestamp
,	PRIMARY KEY (project_id, sha256, tag)
,	FOREIGN KEY (project_id) REFERENCES t_projects(project_id)
,	FOREIGN KEY (sha256) REFERENCES t_files(sha256)
);


CREATE TABLE IF NOT EXISTS t_assets(
	asset_id		TEXT NOT NULL --uuid
,	asset_name		TEXT NOT NULL
,	asset_type		TEXT NOT NULL --audio, video, image
,	created_at		INTEGER NOT NULL --unix timestamp
);




CREATE TABLE IF NOT EXISTS t_asset_files(
	asset_id		TEXT	NOT NULL
,	file_class		TEXT 	NOT NULL --base, thumbnail, audio-peaks, screenlist
,	file_name		TEXT	NOT NULL --original filename at time of upload
,	content_type	TEXT	NOT NULL --mime type
,	sha256			TEXT	NOT NULL --sha256 hash of the file	
,	size			INTEGER
,	created_at		INTEGER	NOT NULL --unix timestamp, original file last modified date
,	uploaded_at		INTEGER			 --unix timestamp
,	PRIMARY KEY (asset_id, file_class)
,	UNIQUE (sha256)
);




CREATE TABLE IF NOT EXISTS t_project_assets(
	project_id		TEXT	NOT NULL
,	asset_id		TEXT	NOT NULL
,	tag				TEXT	NOT NULL --primary deliverable, supplementary media, etc...
--,	path			TEXT			 --potentially usable to create a virtual folder structure for a project
,	added_at		INTEGER NOT NULL --unix timestamp
,	PRIMARY KEY (project_id, asset_id, tag)
,	FOREIGN KEY (project_id)
		REFERENCES t_projects(project_id)
		ON DELETE CASCADE
,	FOREIGN KEY (asset_id)
		REFERENCES t_assets(asset_id)
		ON DELETE CASCADE
);




CREATE TABLE IF NOT EXISTS t_collections(
	collection_id	TEXT	NOT NULL --uuid v4
,	collection_name	TEXT	NOT NULL
,	created_at		INTEGER NOT NULL --unix timestamp
,	PRIMARY KEY (collection_id)
);

CREATE TABLE IF NOT EXISTS t_collection_projects(
	collection_id	TEXT	NOT NULL
,	project_id		TEXT	NOT NULL
,	PRIMARY KEY (collection_id, project_id)
,	FOREIGN KEY (collection_id)
		REFERENCES t_collections(collection_id)
		ON DELETE CASCADE
,	FOREIGN KEY (project_id)
		REFERENCES t_projects(project_id)
		ON DELETE CASCADE
);




CREATE TABLE IF NOT EXISTS t_issues(
	issue_id		TEXT	NOT NULL
,	project_id		TEXT	NOT NULL
,	asset_id		TEXT	NOT NULL
,	user_id			TEXT
,	description		TEXT	NOT NULL
,	timestamp		REAL 	--seconds
,	duration		REAL 	--seconds
,	resolved_at		INTEGER --unix timestamp
,	created_at		INTEGER --unix timestamp
-- ,	updated_at		INTEGER --unix timestamp
,	PRIMARY KEY (issue_id)
,	FOREIGN KEY (project_id, asset_id)
		REFERENCES t_project_assets(project_id, asset_id)
		ON DELETE CASCADE
,	FOREIGN KEY (user_id)
		REFERENCES t_users(user_id)
		ON DELETE SET NULL
);




/**
 * Views
 */
CREATE VIEW IF NOT EXISTS
	v_assets	
AS SELECT
	A.*
,	AF.created_at	
,	AF.uploaded_at
,	AF.content_type
,	AF.size
FROM
	t_assets A
JOIN
	t_asset_files AF ON (A.asset_id = AF.asset_id AND AF.file_class = 'base');




CREATE VIEW IF NOT EXISTS
	v_projects
AS SELECT
	P.*
,	A1.asset_id AS "thumbnail"
,	A2.asset_id AS "backgroundImg"
FROM
	t_projects P
LEFT JOIN
	v_project_assets A1 ON (P.project_id = A1.project_id AND A1.tag = 'thumbnail')
LEFT JOIN
	v_project_assets A2 ON (P.project_id = A2.project_id AND A2.tag = 'background-img');




CREATE VIEW IF NOT EXISTS
	v_user_projects
AS SELECT
	PM.user_id
,	P.*
FROM
	v_projects P
JOIN
	t_project_members PM ON	P.project_id = PM.project_id;




CREATE VIEW IF NOT EXISTS
	v_project_assets
AS SELECT
	PA.project_id
,	PA.tag
,	A.*
,	PA.added_at
FROM
	t_project_assets PA
JOIN
	v_assets A ON (PA.asset_id = A.asset_id);



CREATE VIEW IF NOT EXISTS
	v_user_assets
AS SELECT
	UP.user_id
,	A.asset_id
FROM
	v_user_projects UP
JOIN
	t_project_assets PA USING ( project_id )
JOIN
	t_assets A USING ( asset_id );
	



CREATE VIEW IF NOT EXISTS
	v_user_collections
AS SELECT
	UP.user_id
,	P.collection_id
,	P.collection_name
,	P.created_at
,	COUNT(CP.project_id) AS project_count
,	MAX(P.created_at) AS last_modified
FROM
	t_collections P
JOIN
	t_collection_projects CP ON	P.collection_id = CP.collection_id
JOIN
	v_user_projects UP ON UP.project_id = CP.project_id
GROUP BY
	UP.user_id, P.collection_id, P.collection_name, P.created_at;

CREATE VIEW IF NOT EXISTS 
	v_user_collection_projects
AS SELECT
	CP.collection_id
,	UP.*
FROM
	t_collection_projects CP
JOIN
	v_user_projects UP ON UP.project_id = CP.project_id;


CREATE VIEW IF NOT EXISTS
	v_asset_files
AS SELECT
	ta.asset_id 
,	ta.asset_name
,	ta.asset_type
,	json_group_array(
		json_object(
			'type', taf.file_class,
			'fileName', taf.file_name,
			'sha256', taf.sha256,
			'contentType', taf.content_type,
			'size', taf.size,
			'createdAt', taf.created_at,
			'uploadedAt', taf.uploaded_at	
		)
	) AS files
from		t_assets ta 
join		t_asset_files taf using (asset_id)
group BY  	ta.asset_id	

