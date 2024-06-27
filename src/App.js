import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Navbar.js";
import Content from "./components/content/Content.js";
import Login from './Login.js';
import CreateEvent from "./CreateEvent.js";
import Dashboard from "./Dashboard.js";
import EventsList from "./EventsList.js";
import Events_Details_Page from "./Events_Details_Page.js";
import CertificateCards from "./CertificateCards.js";
import Certificate from "./Certificate.js";
import Admin_login from "./admin/Admin_login.js";
import Sidebar from './components/sidebar/Sidebar';
import { UserProvider } from './UserContext'; // Import UserProvider
import Payment from "./Payment.js"
import EventsHistory  from "./EventsHistory.js";

function App() {
  return (
    <UserProvider> {/* Wrap the application in UserProvider */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomeWithContent />} />
            <Route path="/about" element={<NavbarOnly />} />
            <Route path="/contact" element={<NavbarOnly />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blogs" element={<NavbarOnly />} />
            <Route path="/CreateEvent" element={<PageWithSidebar component={CreateEvent} />} /> 
            <Route path="/Dashboard" element={<PageWithSidebar component={Dashboard} />} />
            <Route path="/EventsList" element={<PageWithSidebar component={EventsList} />} />
            <Route path="/Events_Details_Page" element={<PageWithSidebar component={Events_Details_Page} />} />
            <Route path="/CertificateCards" element={<PageWithSidebar component={CertificateCards} />} />
            <Route path="/Certificate" element={<PageWithSidebar component={Certificate} />} />
            <Route path="/Admin_login" element={<Admin_login />} />
            <Route path="/Payment" element={<PageWithSidebar component={Payment} />} />
            <Route path="/EventsHistory" element={<PageWithSidebar component={EventsHistory} />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

// Home page component with Navbar and main content
const HomeWithContent = () => {
  return (
    <>
      <Navbar />
      <Content />
    </>
  );
};

// Component that renders only the Navbar
const NavbarOnly = () => {
  return <Navbar />;
};

// Component that wraps the passed component with Sidebar layout
const PageWithSidebar = ({ component: Component }) => {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '-10px', width: '100%' }}>
          <Component />
        </div>
      </div>
    </>
  );
};

export default App;
