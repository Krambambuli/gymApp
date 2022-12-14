//put this stuff somwhere else
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    doc,
    collection,
    setDoc,
    getDocs,
    getDoc,
    query,
    where,
    getCollections,
    Timestamp
} from 'firebase/firestore';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAqVlGbbUW7FASp5V9fSkvIUnGmd3pEg7o",
    authDomain: "gym-app-3505b.firebaseapp.com",
    projectId: "gym-app-3505b",
    storageBucket: "gym-app-3505b.appspot.com",
    messagingSenderId: "864133563231",
    appId: "1:864133563231:web:458f5416ac89209c53ecea",
    measurementId: "G-YNXW28W020"
});

const db = getFirestore(firebaseApp);

//todo
function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}${month}${day}`
}

// todo 
// variabls to give with -> Date Object, set, date written out for ID, kg, reps 
export async function writeDay({ date, exercise, sets } = {}) {
    // const dateId = formatDate(date);
    // const setPath = doc(db, 'exercises', exercise, 'set', `${dateId}-${set}`);
    // const docData = {
    //     set: set,
    //     date: Timestamp.fromDate(date),
    //     kg: kg,
    //     reps: reps,
    // };
    // try {
    //     await setDoc(setPath, docData, { merge: true });
    //     console.log(`this value has been written to the database`);
    // } catch (e) {
    //     console.log(`I got an error! ${e}`);
    // }
    const dateId = formatDate(date);
    const setPath = doc(db, 'exercises', exercise, 'set', dateId);
    const docData = {
        date: Timestamp.fromDate(date),
        sets
    };

    // docData[set] = {kg, reps};
    try {
        await setDoc(setPath, docData, { merge: true });
        console.log(`this value has been written to the database`);
    } catch (e) {
        console.log(`I got an error! ${e}`);
    }
}

//todo
//reconstruate Snapshot that every date is together and stuff
export async function getWorkoutHistory(exercise) {
    const content = [];
    const q = query(collection(db, 'exercises', exercise, 'set'));
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            content.push(doc.data())
        });
        console.log(content);
        return content;
    } catch (e) {
        console.log(`I got an error! ${e}`);
    }
}

export async function getExercises(category) {
    //const reps = doc(db, 'exercises', exercise , day , 'sets');
    const exercises = [];
    const q = query(collection(db, 'exercises'), where('category', '==', category));
    try {
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            exercises.push(doc.id);
        });
        console.log(exercises)
        return exercises;
    } catch (e) {
        console.log(`I got an error! ${e}`);
    }
}

//todo
// editSet()
// removeSet()