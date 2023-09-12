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
      const values = [];

      const queryGuestName = `SELECT DISTINCT name FROM guestList`;
      const [guestName] = await dbconnection.execute(queryGuestName, values);

      const queryHostName = "SELECT DISTINCT name FROM hostList";
      const [hostName] = await dbconnection.execute(queryHostName, values);

      dbconnection.end();
      res.status(200).json({ guest: guestName, host: hostName });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: "invalid request method" });
  }
}
