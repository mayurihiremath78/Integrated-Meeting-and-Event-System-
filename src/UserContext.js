// // UserContext.js
// import React, { createContext, useState } from 'react';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState('Username'); // Set initial name
//   const [contact, setContact] = useState('Contact'); // Set initial contact

//   const updateName = (newName) => {
//     setName(newName);
//   };

//   const updateContact = (newContact) => {
//     setContact(newContact);
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, name, updateName, contact, updateContact }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userid: null,
    username: '',
  });
  const [name, setName] = useState('Username');
  const [contact, setContact] = useState('Contact');

  const updateName = (newName) => {
    setName(newName);
  };

  const updateContact = (newContact) => {
    setContact(newContact);
  };

  const setUserDetails = (userid, username) => {
    setUser({ userid, username });
  };

  return (
    <UserContext.Provider value={{ user, setUser, setUserDetails, name, updateName, contact, updateContact }}>
      {children}
    </UserContext.Provider>
  );
};





