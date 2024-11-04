import { SQLDatabase } from "encore.dev/storage/sqldb";

import Pgp from "pg-promise";

const db = new SQLDatabase("todo", {
  migrations: "./migrations",
});

const pgp = Pgp();

export const database = pgp({
  connectionString: db.connectionString,
});
