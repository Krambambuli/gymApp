// ToDo make table componet
// maybe use Material ui table with form on popup to add into table?
// plus edit button to change table content in popup
// on popup maybe slider or some kind of stuff for each set for the reps + possibility to change weight
// no information overload maybe another view for stats and history / progression

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { writeSet, getWorkoutHistory } from './api/firestore';
import { useEffect, useState } from 'react';
import PopUp from '../components/popUp';

export default function ExerciseHistory() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [sets, setSets] = useState({})
  const [date, setDate] = useState({})

  // table Content (History) of all Sets from this Exercises
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    if(!showPopUp){
    const fetchHistory = async () => {
      try {
        const resHistory = await getWorkoutHistory(router.query.name);
        console.log('resHistory', resHistory);
        resHistory.map(day => day.date = day.date.toDate());
        console.log('resHistory', resHistory);
        setHistory(resHistory)
      } catch (e) {
        console.log(e)
      }
    }
    fetchHistory()
    setLoadingHistory(false);
  }
  }, [showPopUp])

  function toggleShowPopUp(){
    return setShowPopUp(!showPopUp);
  };

  function openPopup(day){
    setSets(day.sets);
    setDate(day.date);
    toggleShowPopUp();
  };

  const router = useRouter();
  //make it readable to specify wich var for whiyh thing
  return (<div className="historyMain background">
    <Link href="/">back</Link>
    {router.query.name}
    <div className='historyTable'>
      <div className='header'>
        <div style={{flexBasis: '40%'}}>Date</div>
        <div className='headerPart2'>
        <div>Set</div>
        <div >Rep</div>
        <div >Kg</div>
        </div>
      </div>
      <div className='content'>
      {!loadingHistory && history.map((day, index) => <div className='day' key={index}>
        <div className='date' style={{flexBasis: '40%'}}>
          <p>{day.date.toLocaleDateString()}</p> 
          <button onClick={() => openPopup(history[index])}>edit</button>
        </div>
        <div className='setGroup' style={{flexBasis: '60%'}}>
        {Object.keys(day.sets).map((s) => <div className="set" key={s}>
          <p className='setNumber'>{s}</p>
          <p className='reps'>{day.sets[s].reps}</p>
          <p className='kg'>{day.sets[s].kg}</p>
        </div>)}
        </div>
      </div>)}
      </div>
    </div>


    {/* <table>
      <tr>
        <th>Date</th>
        <th>Set</th>
        <th>Rep</th>
        <th>Kg</th>
      </tr>
      {!loadingHistory && history.map((day, index) => <div key={index}><tr>
        <td rowSpan={Object.keys(day.sets).length + 1}>{day.date.toLocaleDateString()} 
        <button onClick={() => openPopup(history[index])}>edit</button></td>
      </tr>
        {Object.keys(day.sets).map((s) => <tr key={s}>
          <td>{s}</td>
          <td>{day.sets[s].reps}</td>
          <td>{day.sets[s].kg}</td>
        </tr>)}
      </div>)}
    </table> */}
    <button onClick={() => openPopup({date: new Date(), sets: {1: {kg: 0, reps: 0}}})}>
      add
    </button>
    {showPopUp && <PopUp 
    // show={showPopUp} 
    toggleShow={() => toggleShowPopUp()}
    exercise={router.query.name}
    sets={sets}
    date={date}/>}
  </div>)

}

