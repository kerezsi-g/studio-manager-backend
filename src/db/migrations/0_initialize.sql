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
CREATE TABLE IF NOT EXISTS t_project_types(
	project_type_id	TEXT NOT NULL
,	PRIMARY KEY (project_type_id)
);


CREATE TABLE IF NOT EXISTS t_tags(
	project_type_id	TEXT NOT NULL
,	tag				TEXT NOT NULL
,	PRIMARY KEY (project_type_id, tag)
,	FOREIGN KEY (project_type_id) REFERENCES t_project_types(project_type_id)
);

-- Audio project
INSERT INTO t_project_types (project_type_id) VALUES ('audio');
INSERT INTO t_tags (project_type_id, tag) VALUES ('audio', 'delivery');
INSERT INTO t_tags (project_type_id, tag) VALUES ('audio', 'bts');

-- Video project
INSERT INTO t_project_types (project_type_id) VALUES ('video');
INSERT INTO t_tags (project_type_id, tag) VALUES ('video', 'delivery');
INSERT INTO t_tags (project_type_id, tag) VALUES ('video', 'bts');


-- Image gallery project
INSERT INTO t_project_types (project_type_id) VALUES ('photography');
INSERT INTO t_tags (project_type_id, tag) VALUES ('photography', 'unflagged');
INSERT INTO t_tags (project_type_id, tag) VALUES ('photography', 'accepted');
INSERT INTO t_tags (project_type_id, tag) VALUES ('photography', 'rejected');
INSERT INTO t_tags (project_type_id, tag) VALUES ('photography', 'bts');



/**
 * Core objects
 */
CREATE TABLE IF NOT EXISTS t_projects(
	project_id		TEXT	NOT NULL
,	project_name	TEXT	NOT NULL
,	project_type	TEXT	NOT NULL
,	wallpaper		TEXT
,	avatar			TEXT
,	created_at		INTEGER --unix timestamp	
,	PRIMARY KEY (project_id)
,	FOREIGN KEY (project_type) REFERENCES t_project_types(project_type_id)
,	FOREIGN KEY (wallpaper) REFERENCES t_files(sha256)
,	FOREIGN KEY (avatar) REFERENCES t_files(sha256)
);

CREATE TABLE IF NOT EXISTS t_project_members(
	project_id		TEXT	NOT NULL
,	user_id			TEXT	NOT NULL
,	added_at		INTEGER	NOT NULL --unix timestamp
,	PRIMARY KEY (project_id, user_id)
,	FOREIGN KEY (project_id) REFERENCES t_projects(project_id)
,	FOREIGN KEY (user_id) REFERENCES t_users(user_id)
);

CREATE TABLE IF NOT EXISTS t_files(
	sha256			TEXT	NOT NULL --sha256 hash of file
,	file_name		TEXT	NOT NULL --original filename at time of upload
,	content_type	TEXT	NOT NULL --mime type
,	created_at		INTEGER	NOT NULL --unix timestamp
,	uploaded_at		INTEGER	NOT NULL --unix timestamp
,	PRIMARY KEY (sha256)
);

CREATE TABLE IF NOT EXISTS t_project_files(
	project_id		TEXT	NOT NULL
,	sha256			TEXT	NOT NULL
,	tag				TEXT	NOT NULL --primary deliverable, supplementary media, hidden, source file, etc...
,	file_name		TEXT	NOT NULL
,	path			TEXT			 --potentially usable to create a virtual folder structure for a project
,	added_at		INTEGER NOT NULL --unix timestamp
,	PRIMARY KEY (project_id, sha256, tag)
,	FOREIGN KEY (project_id) REFERENCES t_projects(project_id)
,	FOREIGN KEY (sha256) REFERENCES t_files(sha256)
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
,	FOREIGN KEY (collection_id) REFERENCES t_collections(collection_id)
,	FOREIGN KEY (project_id) REFERENCES t_projects(project_id)
);

/**
 * Issues
 */
CREATE TABLE IF NOT EXISTS t_issues(
	issue_id		TEXT	NOT NULL
,	project_id		TEXT	NOT NULL
,	file			TEXT	NOT NULL
,	user_id			TEXT	NOT NULL
,	description		TEXT	NOT NULL
,	timestamp		REAL 	--seconds
,	duration		REAL 	--seconds
,	resolved_at		INTEGER --unix timestamp
,	created_at		INTEGER --unix timestamp
-- ,	updated_at		INTEGER --unix timestamp
,	PRIMARY KEY (issue_id)
,	FOREIGN KEY (project_id, file) REFERENCES t_project_files(project_id, sha256)
,	FOREIGN KEY (user_id) REFERENCES t_users(user_id)
);




CREATE VIEW v_user_projects AS 
SELECT
	PM.user_id
,	P.project_id
,	P.project_name
,	P.project_type
,	P.created_at
FROM
	t_projects P
JOIN
	t_project_members PM ON	P.project_id = PM.project_id;



CREATE VIEW v_user_collections AS 
SELECT
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

CREATE VIEW v_user_collection_projects AS 
SELECT
	UP.user_id	
,	CP.collection_id
,	UP.project_id
,	UP.project_name
,	UP.project_type
,	UP.created_at
FROM
	t_collection_projects CP
JOIN
	v_user_projects UP ON UP.project_id = CP.project_id;



