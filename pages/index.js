import styles from '../styles/Home.module.css';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Layout from '../components/layout';
import { getAllExercises } from '../utils/firestore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import NextLink from 'next/link';

// todo use material ui grid 
// static props could go wrong bc there can be changes to it 
//instead paper other ui component

export async function getStaticProps() {
  const exerciseData = await getAllExercises();
  console.log('inside staticprops',  exerciseData)
  return {
    props: {
      exerciseData,
    },
  };
}

export default function Home({exerciseData}) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

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
                    sx={{
                      width: '100%',
                      height: '100%'
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
