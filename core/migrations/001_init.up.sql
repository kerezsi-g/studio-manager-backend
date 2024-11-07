create table t_collections(
	collection_id uuid primary key default gen_random_uuid(),
	collection_name text not null,
	created timestamptz not null default current_timestamp
);

create table t_media_types(media_type text primary key);

create table t_projects(
	project_id uuid primary key default gen_random_uuid(),
	collection_id uuid not null references t_collections(collection_id),
	media_type text not null references t_media_types(media_type),
	project_name text not null,
	created timestamptz not null default current_timestamp
);

create table t_files(
	file_id uuid primary key default gen_random_uuid(),
	project_id uuid not null references t_projects(project_id),
	path text not null,
	created timestamptz not null default current_timestamp,
	remark text
);

create table t_reviews(
	review_id uuid primary key default gen_random_uuid(),
	content text not null,
	t int4 not null,	
	project_id uuid not null references t_projects(project_id),
	file_id uuid not null references t_files(file_id),
	resolved_by uuid references t_files(file_id),
	created timestamptz not null default current_timestamp
);

create table t_formats(
	format text primary key,
	media_type text not null references t_media_types(media_type),
	name text not null,
	cmd text not null
);

-- create table t_file_formats(
-- 	file_id			uuid not null references t_files(file_id)
-- ,	format			text not null
-- ,	data			bytea not null
-- 	primary key (file_id, format)
-- )
insert into
	t_media_types(media_type)
values
	('audio');

insert into
	t_collections(collection_name, collection_id)
values
	(
		'Example Collection',
		'00000000-0000-0000-0000-000000000000'
	);

/* 
insert into
	t_collections(collection_name)
values
	('Test Collection 2'),
	('Test Collection 3');
 */


insert into
	t_projects(project_id, collection_id, project_name, media_type)
values
	(
		'66919f81-7c51-4d4a-80b7-95a73d750c53',
		'00000000-0000-0000-0000-000000000000',
		'CantinaBand60',
		'audio'
	),
	(
		'ca7f0335-fd27-4302-af05-5fdd5a268500',
		'00000000-0000-0000-0000-000000000000',
		'Fanfare60',
		'audio'
	),
	(
		'75d01f53-f844-48b9-987d-4f11f0717d2a',
		'00000000-0000-0000-0000-000000000000',
		'PinkPanther60',
		'audio'
	);

insert into
	t_files(file_id, project_id, path, created)
values
	(
		'c34a042b-ba1f-4c10-b553-07093c7a2e38',
		'66919f81-7c51-4d4a-80b7-95a73d750c53',
		'files/CantinaBand60.wav',
		current_timestamp - '2 day'::interval
	),
	(
		'c34a042b-ba1f-4c10-b553-07093c7a2e39',
		'66919f81-7c51-4d4a-80b7-95a73d750c53',
		'files/CantinaBand60.wav',
		current_timestamp - '1 day'::interval
	),
	(
		'0da4f456-49e3-4238-a4aa-e842aa217f68',
		'ca7f0335-fd27-4302-af05-5fdd5a268500',
		'files/Fanfare60.wav',
		current_timestamp
	),
	(
		'c66fa2b5-6503-4da0-9fbf-29f78764f3d6',
		'75d01f53-f844-48b9-987d-4f11f0717d2a',
		'files/PinkPanther60.wav',
		current_timestamp
	);

insert into t_reviews(project_id, file_id, t, content, resolved_by, created)
values
	(
		'66919f81-7c51-4d4a-80b7-95a73d750c53',
		'c34a042b-ba1f-4c10-b553-07093c7a2e38',
		15,
		'This is a test review, marked as resolved by version 2',
		'c34a042b-ba1f-4c10-b553-07093c7a2e39',
		current_timestamp - '36 hours'::interval
	),
	(
		'66919f81-7c51-4d4a-80b7-95a73d750c53',
		'c34a042b-ba1f-4c10-b553-07093c7a2e39',
		32,
		'This is a test review, not yet resolved',		
		null,
		current_timestamp - '12 hours'::interval
	);

insert into
	t_formats(format, media_type, name, cmd)
values
	(
		'mp3_v0',
		'audio',
		'MP3 VBR V0',
		'lame -V0 $input $output'
	),
	(
		'mp3_320',
		'audio',
		'MP3 - 320kbps',
		'lame -q0 -b 320 $input $output'
	),
	(
		'mp3_192',
		'audio',
		'MP3 - 192kbps',
		'lame -q0 -b 192 $input $output'
	),
	(
		'flac',
		'audio',
		'FLAC',
		'flac $input -o $output'
	);