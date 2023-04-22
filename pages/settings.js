// file to have a scrollable list with all exercises and possibility to edit category (push, pull, leg), add new exercise, change rotation and s
import React, { useState, useEffect } from 'react'
import Layout from '../components/layout';
import { getAllExercises, writeExercise } from '../utils/firestore';
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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// todo create component for table and maybe popup
function CreateRow(props) {
    const { row } = props;
    const { openPopup } = props;

    const [openRow, setOpenRow] = useState(false);
    console.log('row', row);
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
                        onClick={() => openPopup(row)}
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
    //for Modal
    //todo
    const [showPopUp, setShowPopUp] = useState(false);
    const [exercise, setExercise] = useState('')
    const [category, setCategory] = useState('')
    const [seatPosition, setSeatPosition] = useState(0)
    const [days, setDays] = useState([])

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

    const toggleShowPopUp = () => setShowPopUp(!showPopUp);

    //todo
    const openPopup = (e) => {
        console.log('exercise', e);
        setExercise(e.id)
        setCategory(e.category)
        setSeatPosition(e.seatPosition)
        setDays(e.days)
        toggleShowPopUp();
    }

    //todo   
    async function handleSubmit(event) {
        event.preventDefault();
        // const newSets = {}
        // Object.keys(sets).map(set => {
        //     newSets[set] = {
        //         kg: event.target[`set_${set}_kg`].value,
        //         reps: event.target[`set_${set}_reps`].value
        //     }
        // })
        console.log('this is data: ', {
            exercise: event.target.exercise.value,
            days,
            seatPosition: event.target.seat_position.value,
            category
        })
        await writeExercise({
            exercise: event.target.exercise.value,
            days,
            seatPosition: parseInt(event.target.seat_position.value),
            category
        });
        toggleShowPopUp();
        setLoadingAllExercises(true);
    }

    const handleDays = (event, newDays) => {
        setDays(newDays);
    };

    const handleCategory = (event, newCategory) => {
        setCategory(newCategory);
    };

    // was only necessary to bulk change some data
    // const fillDays = async () => {
    //     console.log('*****')
    //     console.log('its doing it')
    //     const exercisedPairedWithDays = {};
    //     allExercises.map((e) => {
    //         switch (e.category) {
    //             case 'pull':
    //                 return exercisedPairedWithDays[e.id] = ['monday', 'thursday'];
    //             case 'push':
    //                 return exercisedPairedWithDays[e.id] = ['tuesday', 'saturday'];
    //             case 'legs':
    //                 return exercisedPairedWithDays[e.id] = ['wednesday', 'sunday'];
    //         }
    //     })
    //     console.log('exercisedPairedWithDays', exercisedPairedWithDays);
    //     Object.keys(exercisedPairedWithDays).map(async (id) => {
    //         console.log(`${id} => ${exercisedPairedWithDays[id]}`)
    //         await editExercise(id, exercisedPairedWithDays[id]);
    //     })
    //     console.log('****')
    // }

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
                            <CreateRow key={row.id} row={row} openPopup={(d) => openPopup(d)} />
                            // openPopup={() => openPopup()}
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            //todo
            <Fab
                color="primary"
                aria-label="add"
                // maybe format date already here? check how it influancesid generation or maybe reformat date from history to date again
                onClick={() => openPopup({ id: ' ', category: ' ', days: [] })}
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
                                {exercise}
                            </Typography>
                        </Grid>
                        <Grid container item spacing={1} sx={12}>
                            <Grid item sm={12}>
                                <TextField
                                    id={`exercise`}
                                    label="Exercise"
                                    type="text"
                                    defaultValue={exercise}
                                />
                            </Grid>
                            <Grid item sm={12}>
                                <TextField
                                    id={`seat_position`}
                                    label="seat Position"
                                    type="number"
                                    defaultValue={seatPosition}
                                />
                            </Grid>
                            <Grid item md={2}>
                                {category}.
                                {days}.
                            </Grid>
                            <Grid item md={10} sm={12}>
                                <ToggleButtonGroup
                                    value={category}
                                    exclusive
                                    onChange={handleCategory}
                                    aria-label="exercise category"
                                >
                                    <ToggleButton value="legs">legs</ToggleButton>
                                    <ToggleButton value="pull">pull</ToggleButton>
                                    <ToggleButton value="push">push</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid item md={2}>
                                {days}.
                            </Grid>
                            <Grid item md={10} sm={12}>
                                <ToggleButtonGroup
                                    value={days}
                                    orientation="vertical"
                                    onChange={handleDays}
                                    aria-label="exercise days"
                                >
                                    <ToggleButton value="monday">monday</ToggleButton>
                                    <ToggleButton value="tuesday">tuesday</ToggleButton>
                                    <ToggleButton value="wednesday">wednesday</ToggleButton>
                                    <ToggleButton value="thursday">thursday</ToggleButton>
                                    <ToggleButton value="friday">friday</ToggleButton>
                                    <ToggleButton value="saturday">saturday</ToggleButton>
                                    <ToggleButton value="sunday">sunday</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>
                        {/* {Object.keys(sets).map(set => {
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
                        })} */}
                        <Grid item sm={12}>
                            <Button type='submit' >Submit</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Layout>
    );
}