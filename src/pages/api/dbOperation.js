import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const dbconnection = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: 3306,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    connectionLimit: 10,
  });
  if (req.method === "GET") {
    try {
      const pageSize = parseInt(req.query.pageSize);
      const offset = parseInt(req.query.paging);
      const search = req.query.search;
      const filterByGuest = req.query.guestFilter;
      const filterByHost = req.query.hostFilter;
      const values = [];

      let query = "";
      if (filterByGuest === "all" && filterByHost === "all") {
        query = `SELECT * FROM guestList WHERE LOWER(name) LIKE LOWER("%${search}%") OR LOWER(host) LIKE LOWER("%${search}%") OR LOWER(purpose) LIKE LOWER("%${search}%") LIMIT ${pageSize} OFFSET ${offset}`;
      } else {
        if (filterByHost === "all") {
          query = `SELECT * FROM guestList WHERE name="${filterByGuest}" AND (LOWER(name) LIKE LOWER("%${search}%") OR LOWER(host) LIKE LOWER("%${search}%") OR LOWER(purpose) LIKE LOWER("%${search}%")) LIMIT ${pageSize} OFFSET ${offset}`;
        } else if (filterByGuest === "all") {
          query = `SELECT * FROM guestList WHERE host="${filterByHost}" AND (LOWER(name) LIKE LOWER("%${search}%") OR LOWER(host) LIKE LOWER("%${search}%") OR LOWER(purpose) LIKE LOWER("%${search}%")) LIMIT ${pageSize} OFFSET ${offset}`;
        } else {
          query = `SELECT * FROM guestList WHERE name="${filterByGuest}" AND host="${filterByHost}" AND (LOWER(name) LIKE LOWER("%${search}%") OR LOWER(host) LIKE LOWER("%${search}%") OR LOWER(purpose) LIKE LOWER("%${search}%")) LIMIT ${pageSize} OFFSET ${offset}`;
        }
      }
      const connection = await dbconnection.getConnection();
      const [data] = await connection.query(query, values);
      connection.release();
      res.status(200).json({ results: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
          user: process.env.SENDEREMAIL,
          pass: process.env.SENDERPASS,
        },
      });

      const mailOptions = {
        from: process.env.SENDEREMAIL,
        to: "dharmen8980@gmail.com",
        subject: "Guest Checked In",
        text: `Hello ${req.body.host}, your guest ${req.body.name} wants to meet with you for ${req.body.purpose}`,
      };

      const query = "INSERT INTO guestList(name,purpose,host) VALUES(?,?,?)";
      const name = req.body.name;
      const purpose = req.body.purpose;
      const host = req.body.host;
      const values = [name, purpose, host];
      const [data] = await dbconnection.execute(query, values);
      dbconnection.end();
      if (data.affectedRows > 0) {
        res.status(200).json({ message: "success" });
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      } else {
        res.status(500).json({ message: "Internal Server error" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
