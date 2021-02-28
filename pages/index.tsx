import Link from 'next/link';
import { getCurrentDate } from '../components/apis';

const Page = ({ date }) => {
  const handlePure = async () => {
    const res = await fetch(`/api/purge?path=/isg/1`);
    const json = await res.json();

    console.info(json);
  };

  const handleGetCache = async () => {
    const res = await fetch(`/api/cache?path=/isg/1`);
    const json = await res.json();

    console.info(json);
  };

  return (
    <>
      <h1>Home</h1>
      <Link href="/isg/1"><a>ISG <i>(<code>fallback: blocking</code>)</i></a></Link>
      <p>
        <button onClick={handlePure}>Purge /isg/1</button>
      </p>
      <p>
        <button onClick={handleGetCache}>Get Cache</button>
      </p>

      <p>Build time: {date}</p>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {
      date: getCurrentDate(),
    },
  };
}

export default Page;
