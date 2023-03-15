import React from 'react'
import { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


export default function dayModal(props) {
    const [amountOfSets, setAmountOfSets] = useState({});

    useEffect(() => {
        // populate amountOfSets
        // if (props.show) {
            setAmountOfSets(props.sets);
        // }
    // }, [props.show]);
    }, []);

    function addSet() {
        const refamountOfSets = { ...amountOfSets };
        refamountOfSets[Object.keys(refamountOfSets).length + 1] = { kg: 0, reps: 0 };
        console.log('refamountOfSets', refamountOfSets);
        setAmountOfSets(refamountOfSets);
    }

    function removeSet() {
        if (Object.keys(amountOfSets).length > 1) {
            const refamountOfSets = { ...amountOfSets };
            delete refamountOfSets[Object.keys(refamountOfSets).length];
            console.log('refamountOfSets', refamountOfSets);
            setAmountOfSets(refamountOfSets);
        }
    }

    async function handleSubmit(event) {
        console.log('it works');
        event.preventDefault();
        const sets = {};
        Object.keys(amountOfSets).map(set => {
            sets[set] = {
                kg: event.target[`set_${set}_kg`].value,
                reps: event.target[`set_${set}_reps`].value
            }
        });
        await writeDay({
            date: props.date,
            exercise: props.exercise,
            sets
        });
        props.toggleShow();
    }


    console.log('sets', props.sets)
    console.log('amountOfSets', amountOfSets)

  return (
    <Modal
        open={true}
        onClose={() => props.toggleShow}
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
            {props.date}
          </Typography>
          
        </Box>
      </Modal>
//   <div className='popup'>
//         <p>Add Set on </p>
//         {/* https://react-hook-form.com/get-started */}
//         {/* https://stackoverflow.com/questions/67150288/event-in-javascript-is-deprecated-and-i-cannot-use-preventdefault */}
//         <form onSubmit={handleSubmit}>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px'}}>
//                 {/* todo */}
//                 {/* maybe use grid insted Table */}
//                 {/* use Input */}
//                 <div style={{display: 'flex', justifyContent: 'space-around'}}>
//                     <p>reps</p>
//                     <p>kg</p>
//                 </div>
//                 {Object.keys(amountOfSets).map(set => {
//                         return <div style={{display: 'flex', justifyContent: 'space-around'}} key={set}>
//                                 <input
//                                     className='inputField'
//                                     type={'number'}
//                                     id={`set_${set}_reps`}
//                                     name={`set_${set}_reps`}
//                                     defaultValue={amountOfSets[set].reps}
//                                 />
//                                 <input
//                                     className='inputField'
//                                     type={'number'}
//                                     id={`set_${set}_kg`}
//                                     name={`set_${set}_kg`}
//                                     defaultValue={amountOfSets[set].kg}
//                                 />
//                         </div>
//                     })}
                /* <table>
                    <tr>
                        <th> </th>
                        <th>reps</th>
                        <th>kg</th>
                    </tr>
                    {Object.keys(amountOfSets).map(set => {
                        return <tr key={set}>
                            <th>Set {set}</th>
                            <td>
                                <input
                                    type={'number'}
                                    id={`set_${set}_reps`}
                                    name={`set_${set}_reps`}
                                    defaultValue={amountOfSets[set].reps}
                                />
                            </td>
                            <td>
                                <input
                                    type={'number'}
                                    id={`set_${set}_kg`}
                                    name={`set_${set}_kg`}
                                    defaultValue={amountOfSets[set].kg}
                                />
                            </td>
                        </tr>
                    })}
                </table> */

    //             <button type={'button'} onClick={() => addSet()}>Add Set</button>
    //             <button type={'button'} onClick={() => removeSet()}>Remove Set</button>
    //         </div>
    //         {/* <button onClick={() => submit()}>Submit</button> */}
    //         <input type={'submit'} value={'Submit'} />
    //     </form>
    // </div>
  )
}
