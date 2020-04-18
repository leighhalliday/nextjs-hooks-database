import knex from "knex";
import onDeath from "death";

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_HOOKS_DEMO,
  debug: false,
  pool: { min: 1, max: 5 },
});

// Try to catch node shutting down and explicitly close
// connection to database
onDeath(() => {
  db.destroy();
});

export { db };
