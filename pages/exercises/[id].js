// react
import { useState } from 'react'
import { useRouter } from 'next/router';
// components
import Layout from '../../components/layout';
import DayModal from '../../components/dayModal'
// firebase
import { writeSet, getWorkoutHistory, getAllExerciseIds, formatDate, writeDay } from '../../utils/firestore';
// nextJS
import NextLink from 'next/link'
// mui
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';


// todo 
// use Modal from mui for pop up
// use table from mui 
// maybe not static caouse updatet in app
export async function getStaticProps({ params }) {
  console.log('params', params)
  const exerciseHistory = await getWorkoutHistory(params.id)
  console.log('exerciseHistory', exerciseHistory)
// use revalidate after adding or editing
  return {
    props: {
      exerciseHistory,
      name: params.id
    },
  };
}

// not sure if will work but think/hope so
// https://stackoverflow.com/questions/62057131/next-js-getstaticpaths-list-every-path-or-only-those-in-the-immediate-vicinity

export async function getStaticPaths() {
  const paths = await getAllExerciseIds();
  console.log('paths are: ', paths)
  return {
    paths,
    fallback: true, // or blocking
  };
}

function CreateRow(props) {
  const { row } = props;
  const { openPopup } = props;

  const [openRow, setOpenRow] = useState(false);
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenRow(!openRow)}
          >
            {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align='center'>
          {row.date}
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => openPopup({ date: row.date, sets: row.sets })}
          >
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openRow} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Set</TableCell>
                    <TableCell align='center'>Rep</TableCell>
                    <TableCell align='center'>Kg</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(row.sets).map((s) => (
                    <TableRow key={s}>
                      <TableCell component="th" scope="row" align='center'>
                        {s}
                      </TableCell>
                      <TableCell align='center'>{row.sets[s].reps}</TableCell>
                      <TableCell align='center'>{row.sets[s].kg}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function Exercise({ exerciseHistory, name }) {

  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);
  const [sets, setSets] = useState({})
  const [date, setDate] = useState({})

  const toggleShowPopUp = () => setShowPopUp(!showPopUp);

  const openPopup = (day) => {
    console.log('day', day);
    setSets(day.sets);
    setDate(day.date);
    toggleShowPopUp();
  }

  function addSet() {
    const refamountOfSets = { ...sets };
    refamountOfSets[Object.keys(refamountOfSets).length + 1] = { kg: 0, reps: 0 };
    console.log('refamountOfSets', refamountOfSets);
    setSets(refamountOfSets);
  }

  function removeSet() {
    if (Object.keys(sets).length > 1) {
      const refamountOfSets = { ...sets };
      delete refamountOfSets[Object.keys(refamountOfSets).length];
      console.log('refamountOfSets', refamountOfSets);
      setSets(refamountOfSets);
    }
  }

  async function handleSubmit(event) {
    console.log('it works');
    event.preventDefault();
    const newSets = {}
    Object.keys(sets).map(set => {
      newSets[set] = {
        kg: event.target[`set_${set}_kg`].value,
        reps: event.target[`set_${set}_reps`].value
    }
    })
    await writeDay({
        date,
        exercise: name,
        sets: newSets
    });

    // toggleShowPopUp();
}

  console.log('this is inside exercisehistory', exerciseHistory)
  console.log('this is inside name', name)
  if (router.isFallback) {
    return <div>loading...</div>
  }
  return (
    <Layout>
      <NextLink href='/'>back</NextLink>
      <TableContainer component={Paper} sx={{ opacity: 0.9 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align='center'>{name}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {exerciseHistory.map((row) => (
              <CreateRow key={row.date} row={row} openPopup={(d) => openPopup(d)} />
              // openPopup={() => openPopup()}
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        color="primary"
        aria-label="add"
        // maybe format date already here? check how it influancesid generation or maybe reformat date from exercisehistory to date again
        onClick={() => openPopup({ date: formatDate(new Date()), sets: { 1: { kg: 0, reps: 0 } } })}
        sx={{
          position: 'fixed',
          bottom: '65px',
          right: '15px',
        }}>
        <AddIcon />
      </Fab>
      {/* maybe put modal in an other component */}
      {/* {showPopUp && <DayModal
        show={showPopUp} 
        toggleShow={() => toggleShowPopUp()}
        exercise={name}
        sets={sets}
        date={date} />} */}
      <Modal
        open={showPopUp}
        onClose={() => toggleShowPopUp()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {date}
              </Typography>
            </Grid>
            {Object.keys(sets).map(set => {
              console.log('this is what is inside set', set)
              return <Grid container item spacing={1} sx={12}>
                <Grid item md={2}>
                  {set}.
                </Grid>
                <Grid container item spacing={1} md={10} sm={12}>
                  <Grid item xs={6}>
                    <TextField
                      id={`set_${set}_reps`}
                      label="Reps"
                      type="number"
                      defaultValue={sets[set].reps}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id={`set_${set}_kg`}
                      label="Kg"
                      type="number"
                      defaultValue={sets[set].kg}
                    />
                  </Grid>
                </Grid>
              </Grid>
            })}
            <Grid item md={6} sm={12}>
              <Button variant="contained" onClick={() => removeSet()}>remove Set</Button>
            </Grid>
            <Grid item md={6} sm={12}>
              <Button variant="contained" onClick={() => addSet()}>add Set</Button>
            </Grid>
            <Grid item sx={12}>
              <Button type='submit' >Submit</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Layout>
  );
}


