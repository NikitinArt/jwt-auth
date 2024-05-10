import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  password: "1423",
  host: "wolfhost.ru",
  port: 5432,
  database: "postgres",
});

export default pool;
