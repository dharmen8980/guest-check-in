import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const dbconnection = await mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: 3306,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  });
  if (req.method === "GET") {
    try {
      const hostName = req.query.hostName;
      const values = [];

      const query = `SELECT DISTINCT name FROM hostList WHERE LOWER(name) LIKE LOWER('%${hostName}%') LIMIT 5`;

      const [data] = await dbconnection.execute(query, values);
      dbconnection.end();
      res.status(200).json({ results: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: "invalid request method" });
  }
}
