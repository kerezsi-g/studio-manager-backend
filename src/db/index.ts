import { Database } from "bun:sqlite";

import fs from "fs";

const db = new Database(":memory:", {
  create: true,
  strict: true,
});

/**
 * TODO: Implement proper migration functionality
 */
const sql = fs.readFileSync("src/db/migrations/0_initialize.sql", "utf8");

db.run(sql);

export { db };


