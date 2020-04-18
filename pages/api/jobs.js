import { db } from "../../src/db";

export default async (req, res) => {
  let query = db.select("*").from("jobs");
  if (req.query.company_id) {
    query = query.where({ company_id: req.query.company_id });
  }
  const jobs = await query.limit(50);

  const companyIds = [...new Set(jobs.map(({ company_id }) => company_id))];
  const companies = await db
    .select("*")
    .from("companies")
    .whereIn("id", companyIds);
  const companyDict = companies.reduce((acc, company) => {
    return { ...acc, [company.id]: company };
  }, {});

  const data = jobs.map((job) => {
    return {
      ...job,
      company: companyDict[job.company_id],
    };
  });

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};
