import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import './index.css';
import ProfilePage from './pages/ProfilePage.jsx';
import Login from './pages/Login.jsx';
import Header from './pages/Header.jsx';
import SignUp from './pages/Signup.jsx';
import ResumeBuild from './pages/ResumePage.jsx';
import Favorties from './pages/Favorites.jsx';

const Main = () => {
  // Handles whether the user is logged in or not (global)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState(0);
  const [infoFilled, setInfoFilled] = useState(false);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <Router>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setUserID={setUserID}
        setInfoFilled={setInfoFilled} />
      <Routes>
        <Route path="/" element={<Home
          infoFilled={infoFilled}
          userID={userID}
          isLoggedIn={isLoggedIn}
          address={address}
          phoneNumber={phoneNumber}
          email={email}
          firstName={firstName}
          lastName={lastName} />} />
        <Route path="/login" element={<Login
          setIsLoggedIn={setIsLoggedIn}
          setUserID={setUserID} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage
          userID={userID}
          setInfoFilled={setInfoFilled}
          address={address}
          setAddress={setAddress}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          email={email}
          setEmail={setEmail}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName} setLastName={setLastName} />} />
        <Route path="/resumebuild" element={<ResumeBuild />} />
        <Route path="/favorites" element={<Favorties
          userID={userID}
          address={address}
          phoneNumber={phoneNumber}
          email={email}
          firstName={firstName}
          lastName={lastName} />} />
        <Route path="*" element={<Home />} /> {/* Fallback route */}
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
);