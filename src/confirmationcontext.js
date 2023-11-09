import React, { createContext, useContext, useState } from 'react';

// Create a context for managing the confirmation state
const ConfirmationContext = createContext();

export const useConfirmation = () => {
  return useContext(ConfirmationContext);
};

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState('');

  return (
    <ConfirmationContext.Provider value={{ confirmation, setConfirmation }}>
      {children}
    </ConfirmationContext.Provider>
  );
};
