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
 * Core objects
 */
CREATE TABLE IF NOT EXISTS t_projects(
	project_id		TEXT	NOT NULL
,	project_name	TEXT	NOT NULL
,	project_type	TEXT	NOT NULL
,	created_at		INTEGER --unix timestamp
,	PRIMARY KEY (project_id)
);

CREATE TABLE IF NOT EXISTS t_project_members(
	project_id		TEXT	NOT NULL
,	user_id			TEXT	NOT NULL
,	PRIMARY KEY (project_id, user_id)
,	FOREIGN KEY (project_id) REFERENCES t_projects(project_id)
,	FOREIGN KEY (user_id) REFERENCES t_users(user_id)
);

CREATE TABLE IF NOT EXISTS t_files(
	file_id			TEXT	NOT NULL --sha256 hash of file
,	file_name		TEXT	NOT NULL
,	storage_type	TEXT	NOT NULL
,	created_at		INTEGER --unix timestamp
,	PRIMARY KEY (file_id)
);

CREATE TABLE IF NOT EXISTS t_project_files(
	project_id		TEXT	NOT NULL
,	file_id			TEXT	NOT NULL
,	category		TEXT	NOT NULL --primary deliverable, supplementary media, hidden, source file, etc...
,	PRIMARY KEY (project_id, file_id, category)
,	FOREIGN KEY (project_id) REFERENCES t_projects(project_id)
,	FOREIGN KEY (file_id) REFERENCES t_files(file_id)
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
,	user_id			TEXT	NOT NULL
,	description		TEXT	NOT NULL
,	timestamp		INTEGER --ms
,	duration		INTEGER --ms
,	resolved_at		INTEGER --unix timestamp
,	created_at		INTEGER --unix timestamp
-- ,	updated_at		INTEGER --unix timestamp
,	PRIMARY KEY (issue_id)
,	FOREIGN KEY (project_id) REFERENCES t_projects(project_id)
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



