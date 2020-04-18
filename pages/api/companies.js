import { db } from "../../src/db";

export default async (req, res) => {
  const companies = await db.select("*").from("companies").limit(50);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(companies));
};
