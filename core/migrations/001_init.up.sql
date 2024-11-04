create table t_projects(
	project_id uuid primary key default gen_random_uuid(),
	project_name text not null,
	created timestamptz not null default current_timestamp
);

create table t_media_types(media_type text primary key);

create table t_assets(
	asset_id uuid primary key default gen_random_uuid(),
	project_id uuid not null references t_projects(project_id),
	media_type text not null references t_media_types(media_type),
	asset_name text not null,
	created timestamptz not null default current_timestamp
);

create table t_files(
	file_id uuid primary key default gen_random_uuid(),
	asset_id uuid not null references t_assets(asset_id),
	path text not null,
	created timestamptz not null default current_timestamp,
	remark text
);

create table t_annotations(
	annotation_id uuid primary key default gen_random_uuid(),
	asset_id uuid not null references t_assets(asset_id),
	t int2 not null,
	created_for uuid not null references t_files(file_id),
	resolved_at uuid references t_files(file_id),
	created_at timestamptz not null default current_timestamp
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
	t_projects(project_name, project_id)
values
	(
		'Example Project',
		'00000000-0000-0000-0000-000000000000'
	);

/* 
insert into
	t_projects(project_name)
values
	('Test Project 2'),
	('Test Project 3');
 */


insert into
	t_assets(asset_id, project_id, asset_name, media_type)
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
	t_files(file_id, asset_id, path)
values
	(
		'c34a042b-ba1f-4c10-b553-07093c7a2e38',
		'66919f81-7c51-4d4a-80b7-95a73d750c53',
		'files/CantinaBand60.wav'
	),
	(
		'c34a042b-ba1f-4c10-b553-07093c7a2e39',
		'66919f81-7c51-4d4a-80b7-95a73d750c53',
		'files/CantinaBand60.wav'
	),
	(
		'0da4f456-49e3-4238-a4aa-e842aa217f68',
		'ca7f0335-fd27-4302-af05-5fdd5a268500',
		'files/Fanfare60.wav'
	),
	(
		'c66fa2b5-6503-4da0-9fbf-29f78764f3d6',
		'75d01f53-f844-48b9-987d-4f11f0717d2a',
		'files/PinkPanther60.wav'
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