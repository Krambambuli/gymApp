import React, {useState, useEffect} from 'react'
import styles from '../styles/Home.module.css';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Layout from '../components/layout';
import { getAllExercises } from '../utils/firestore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import NextLink from 'next/link';
import { useRouter } from 'next/router'


// todo use material ui grid 
//instead paper other ui component
// static props could go wrong bc there can be changes to it 
// not static
// export async function getStaticProps() {
//   const exerciseData = await getAllExercises();
//   console.log('inside staticprops',  exerciseData)
//   return {
//     props: {
//       exerciseData,
//     },
//   };
// }

// export default function Home({exerciseData}) {
export default function Home() {
  const router = useRouter()
  const [exerciseData, setExerciseData] = useState([])
  const [loadingExerciseData, setLoadingExerciseData] = useState(true)
  const today = new Date()
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] 

  //check if it runs every page load so to fetch data here to
  useEffect(() => {
    router.push(`/#${days[today.getDay() - 1]}`);
    // const exerciseData = await getAllExercises();
  }, [])

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const resExerciseData = await getAllExercises();
        setExerciseData(resExerciseData)
      } catch (e) {
        console.log(e)
      }
    }
    fetchExerciseData()
    // use context to set if today already done
    setLoadingExerciseData(false);

    // return () => {
    //   second
    // }
  }, [loadingExerciseData])
  

  return (
    <Layout>
    {/* <div className={styles.workout}> */}
      {
        days.map((day) => <section>
          <p className={styles.dayTitle} id={day}>{day.toUpperCase()}</p>
          <div className={styles.exerciseGrid}>
            {
              exerciseData.map((exercise) => {
                return exercise.days && exercise.days.includes(day) && (
                  // <Card variant="outlined">{exercise.id}</Card>
                  <NextLink href={`/exercises/${exercise.id}`}>
                    <Paper 
                    sx={ {
                      width: '100%',
                      height: '100%',
                      opacity: 0.9,
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      color: 'white',
                      backgroundColor: new Date(exercise.latest).toDateString() === today.toDateString() ? '#358d6c' : '#1f1e1e',
                    }}
                    elevation={5}
                    >
                      {exercise.id}
                      </Paper>
                  </NextLink>
                  )
                  // <Button variant="contained" color='primary' >{exercise.id}</Button>
                // return exercise.days && exercise.days.includes(day) && <Paper elevation={5}>{exercise.id}</Paper>
              })
            }
          </div>
        </section>)
      }
    {/* </div> */}
    </Layout>
  )
}
