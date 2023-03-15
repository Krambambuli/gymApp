// file to have a scrollable list with all exercises and possibility to edit category (push, pull, leg), add new exercise, change rotation and s
import React, { useState, useEffect } from 'react'
import Layout from '../components/layout';
import { getAllExercises, editExercise } from '../utils/firestore';
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

// todo create component for table and maybe popup
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
                    {row.id}
                </TableCell>
                <TableCell align="right">
                    <IconButton
                        aria-label="edit row"
                        size="small"
                        onClick={() => openPopup({ id: row.id })}
                    >
                        <EditIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRow} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="sets">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>category</TableCell>
                                        <TableCell align='center'>days</TableCell>
                                        <TableCell align='center'>seatPosition</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align='center'>
                                            {row.category}
                                        </TableCell>
                                        <TableCell align='center'>{row.days}</TableCell>
                                        <TableCell align='center'>{row.seatposition}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function Settings() {
    const [allExercises, setAllExercises] = useState([])
    const [loadingAllExercises, setLoadingAllExercises] = useState([])

    useEffect(() => {
        const fetchAllExercises = async () => {
            try {
                const resExercises = await getAllExercises();
                setAllExercises(resExercises)
            } catch (e) {
                console.log(e)
            }
        }
        fetchAllExercises()
        setLoadingAllExercises(false);

        // return () => {
        //   second
        // }
    }, [loadingAllExercises])

    const fillDays = async () => {
        console.log('*****')
        console.log('its doing it')
        const exercisedPairedWithDays = {};
        allExercises.map((e) => {
            switch (e.category) {
                case 'pull':
                    return exercisedPairedWithDays[e.id] = ['monday', 'thursday'];
                case 'push':
                    return exercisedPairedWithDays[e.id] = ['tuesday', 'saturday'];
                case 'legs':
                    return exercisedPairedWithDays[e.id] = ['wednesday', 'sunday'];
            }
        })
        console.log('exercisedPairedWithDays', exercisedPairedWithDays);
        Object.keys(exercisedPairedWithDays).map( async (id) => {
            console.log(`${id} => ${exercisedPairedWithDays[id]}`)
            await editExercise(id, exercisedPairedWithDays[id]);
        })
        console.log('****')
    }

    console.log('allExercises', allExercises)
    return (
        <Layout>
            {/* <Button onClick={() => fillDays()} variant='contained'>fill</Button> */}
            <TableContainer component={Paper} sx={{ opacity: 0.9 }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align='center'>All Exercises</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!loadingAllExercises && allExercises.map((row) => (
                            <CreateRow key={row.id} row={row} openPopup={(d) => console.log(d)} />
                            // openPopup={() => openPopup()}
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Layout>
    );
}