


// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import { UserProvider } from './UserContext';
// import ChattingPage from './ChattingPage';

// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render( <UserProvider>
//     <App />
//   </UserProvider>,);



import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ChattingPage from './ChattingPage';
import { UserProvider } from './UserContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <UserProvider>
    <App>
      <ChattingPage />
    </App>
  </UserProvider>
);