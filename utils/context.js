import { createContext, useContext, useState } from 'react';

export const AppContext = createContext();

export function AppWrapper({ children }) {
  //get initial object from firestore
    const [dayDone, setDayDone] = useState({})
    // const exerciseDone = {}

  return (
    // <AppContext.Provider value={exerciseDone}>
    <AppContext.Provider value={{dayDone, setDayDone}}>
      {children}
    </AppContext.Provider>
  );
}

// export function useAppContext() {
//   return useContext(AppContext);
// }