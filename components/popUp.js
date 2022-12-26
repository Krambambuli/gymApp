import React from 'react'
import Link from 'next/link'
import { writeDay, getWorkoutHistory } from '../pages/api/firestore';
import { useEffect, useState } from 'react';

export default function PopUp(props) {

    // const [loadingSet, setLoadingSet] = useState(true)
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
    return (<div className='popup'>
        <p>Add Set on </p>
        {/* https://react-hook-form.com/get-started */}
        {/* https://stackoverflow.com/questions/67150288/event-in-javascript-is-deprecated-and-i-cannot-use-preventdefault */}
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px'}}>
                {/* todo */}
                {/* maybe use grid insted Table */}
                {/* use Input */}
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <p>reps</p>
                    <p>kg</p>
                </div>
                {Object.keys(amountOfSets).map(set => {
                        return <div style={{display: 'flex', justifyContent: 'space-around'}} key={set}>
                                <input
                                    className='inputField'
                                    type={'number'}
                                    id={`set_${set}_reps`}
                                    name={`set_${set}_reps`}
                                    defaultValue={amountOfSets[set].reps}
                                />
                                <input
                                    className='inputField'
                                    type={'number'}
                                    id={`set_${set}_kg`}
                                    name={`set_${set}_kg`}
                                    defaultValue={amountOfSets[set].kg}
                                />
                        </div>
                    })}
                {/* <table>
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
                </table> */}

                <button type={'button'} onClick={() => addSet()}>Add Set</button>
                <button type={'button'} onClick={() => removeSet()}>Remove Set</button>
            </div>
            {/* <button onClick={() => submit()}>Submit</button> */}
            <input type={'submit'} value={'Submit'} />
        </form>
    </div>)
}