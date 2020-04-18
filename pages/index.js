import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Home = () => {
  const { data: jobs } = useSWR("/api/jobs", fetcher);

  return (
    <div>
      <Head>
        <title>Jobs Jobs Jobs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Jobs Jobs Jobs</h1>

      {jobs ? (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <Link href="/jobs/[id]" as={`/jobs/${job.id}`}>
                <a>{job.title}</a>
              </Link>
              @
              <Link href="/companies/[id]" as={`/companies/${job.company.id}`}>
                <a>{job.company.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>Loading jobs...</div>
      )}
    </div>
  );
};

export default Home;
