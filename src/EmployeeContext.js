import { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
  const [employeeName, setEmployeeName] = useState(''); // Initialize with an empty string

  return (
    <EmployeeContext.Provider value={{ employeeName, setEmployeeName }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeContext() {
  return useContext(EmployeeContext);
}
