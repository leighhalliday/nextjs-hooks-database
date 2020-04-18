import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "../../src/db";

export default function Company({ company }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>{company.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>{company.name}</h1>
      <p>
        <a href={company.url}>{company.url}</a>
      </p>
      <p>{company.about}</p>
    </div>
  );
}

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
