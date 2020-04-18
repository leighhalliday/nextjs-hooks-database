import Head from "next/head";
import { db } from "../../src/db";

export default function Job({ job, company }) {
  return (
    <div>
      <Head>
        <title>
          {job.title} @ {company.name}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>
        {job.title} @ {company.name}
      </h1>
    </div>
  );
}

export async function getServerSideProps({ params, res }) {
  const job = await db
    .select("*")
    .from("jobs")
    .where({ id: params.id })
    .first();

  if (!job) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  const company = await db
    .select("*")
    .from("companies")
    .where({ id: job.company_id })
    .first();

  return { props: { job, company } };
}
