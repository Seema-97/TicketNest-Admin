import { createContext, useContext, useState } from "react";

const myContext = createContext();

export const useMyContext = () => {
    return useContext(myContext)
}

const ContextProvider = ({ children }) => {

    const[employeeId , setEmployeeId] = useState('') ;
    const[authorisedFieldValue , setAuthorisedFieldValue] = useState('')

  return <myContext.Provider value={{employeeId , setEmployeeId , authorisedFieldValue , setAuthorisedFieldValue}}>{children}</myContext.Provider>;
};


 export default ContextProvider
