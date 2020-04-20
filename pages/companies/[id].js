import { useRouter } from "next/router";
import useSWR from "swr";
import { db } from "../../src/db";

export default function Company({ company }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading company...</div>;
  }

  return (
    <div>
      <h1>Jobs @ {company.name}</h1>
      <p>
        <a href={company.url}>{company.url}</a>
      </p>
      <p>{company.about}</p>
      <Jobs id={company.id} />
    </div>
  );
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Jobs({ id }) {
  const { data: jobs, error } = useSWR(`/api/jobs?company_id=${id}`, fetcher);

  if (!jobs || error) return null;

  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>{job.title}</li>
      ))}
    </ul>
  );
}

export async function getStaticPaths() {
  const companies = await db
    .select("id")
    .from("companies")
    .where({ featured: true });

  const paths = companies.map(({ id }) => {
    return {
      params: { id: id.toString() },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const company = await db
    .select("*")
    .from("companies")
    .where({ id: params.id })
    .first();

  return {
    props: { company },
  };
}
