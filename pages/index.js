import Head from 'next/head'
import Image from 'next/image'
import Button from '@mui/material/Button';
import Tabs from '../src/components/Tabs';
import Link from 'next/link';
import { getExercises } from './api/firestore';
import { useEffect, useState } from 'react';
import { async } from '@firebase/util';

function Exercise(props) {
  return <Link href={{
    pathname: "/exerciseHistory",
    query: { name: props.name }
  }
  }><div className='exerciseTile'>{props.name}</div></Link>
}

export default function Home() {
  const [legs, setLegs] = useState([]);
  const [push, setPush] = useState([]);
  const [pull, setPull] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const resLegs = await getExercises('legs');
        const resPush = await getExercises('push');
        const resPull = await getExercises('pull');
        setLegs(resLegs)
        setPush(resPush)
        setPull(resPull)
      } catch (e) {
        console.log(e)
      }
    }
    fetchExercises()
    setLoading(false);
  }, [])

  // writeSet();
  console.log('this legs', legs)
  return (
    <div id='main' className='background'>
      {/* <Head>
        <title>Gym Journal</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <Head>
        <title>Gym Journal</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
      </Head>
      {/* <nav>
        <a href='#tuesday'>test</a>
      </nav> */}

      <section>
        <p className='dayTitle'>Monday</p>
        <div className='exerciseGrid'>
          {!loading && push.map((exercise) => <Exercise key={exercise} name={exercise} />)}
        </div>
      </section>

      <section>
        <p className='dayTitle' id='tuesday'>Tuesday</p>
        <div className='exerciseGrid'>
          {!loading && pull.map((exercise) => <Exercise key={exercise} name={exercise} />)}
        </div>
      </section>
      <section>
        <p className='dayTitle' id='tuesday'>Wednesday</p>
        <div className='exerciseGrid'>
          {!loading && legs.map((exercise) => <Exercise key={exercise} name={exercise} />)}
        </div>
      </section>
      <section>
        <p className='dayTitle' id='tuesday'>Thursday</p>
        {/* <div className='exerciseGrid'>
          {!loading && legs.map((exercise) => <Exercise name={exercise} />)}
        </div> */}
      </section>
      <section>
        <p className='dayTitle' id='tuesday'>Friday</p>
        <div className='exerciseGrid'>
          {!loading && push.map((exercise) => <Exercise key={exercise} name={exercise} />)}
        </div>
      </section>
      <section>
        <p className='dayTitle' id='tuesday'>Saturday</p>
        <div className='exerciseGrid'>
          {!loading && pull.map((exercise) => <Exercise key={exercise} name={exercise} />)}
        </div>
      </section>
      <section>
        <p className='dayTitle' id='tuesday'>Sunday</p>
        <div className='exerciseGrid'>
          {!loading && legs.map((exercise) => <Exercise key={exercise} name={exercise} />)}
        </div>
      </section>

      {/* <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}
