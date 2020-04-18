import { useRouter } from "next/router";
import useSWR from "swr";
import { db } from "../../src/db";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Company({ company }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{company.name}</h1>
      <p>
        <a href={company.url}>{company.url}</a>
      </p>
      <p>{company.about}</p>

      <Jobs id={company.id} />
    </div>
  );
}

const Jobs = ({ id }) => {
  const { data: jobs } = useSWR(`/api/jobs?company_id=${id}`, fetcher);

  if (!jobs) return null;

  return (
    <div>
      <h2>Jobs Jobs Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <a>{job.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getStaticPaths() {
  const companies = await db
    .select("id")
    .from("companies")
    .where({ featured: true });

  return {
    paths: companies.map((company) => ({
      params: { id: company.id.toString() },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const company = await db
    .select("*")
    .from("companies")
    .where({ id: params.id })
    .first();

  return { props: { company } };
}
