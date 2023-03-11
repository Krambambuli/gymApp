// react
import { useState } from 'react'
import { useRouter } from 'next/router';
// css
import Layout from '../../components/layout';
// firebase
import { writeSet, getWorkoutHistory, getAllExerciseIds } from '../../utils/firestore';
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
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

// todo 
// use Modal from mui for pop up
// use table from mui 
// maybe not static caouse updatet in app
export async function getStaticProps({ params }) {
  console.log('params', params)
  const exerciseHistory = await getWorkoutHistory(params.id)
  console.log('exerciseHistory', exerciseHistory)
  //   const postData = await getPostData(params.id);
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
    fallback: true,
  };
}

function CreateRow(props) {
  const { row } = props;
  const {openPopup} = props;

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
            onClick={() => openPopup({date: row.date, sets: row.sets})}
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
  const [date, setDate] = useState(false)

  const toggleShowPopUp = () => setShowPopUp(!showPopUp);

  const openPopup = (day) => {
    console.log('day', day);
    setSets(day.sets);
    setDate(day.date);
    toggleShowPopUp();
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
        // onClick={() => toggleShowPopUp()}
        // maybe format date already here? check how it influancesid generation or maybe reformat date from exercisehistory to date again
        onClick={() => openPopup({ date: new Date(), sets: { 1: { kg: 0, reps: 0 } } })}
        sx={{
          position: 'fixed',
          bottom: '65px',
          right: '15px',
        }}>
        <AddIcon />
      </Fab>
      {/* maybe put modal in an other component */}
      <Modal
        open={showPopUp}
        onClose={() => toggleShowPopUp()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {/* {date && date.toLocaleDateString() ? date.toLocaleDateString() : date} */}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </Layout>
  );
}


