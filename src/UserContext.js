import React from 'react';

const UserContext = React.createContext();

// Export both UserContext and UserProvider
export const UserProvider = UserContext.Provider;

export default UserContext;