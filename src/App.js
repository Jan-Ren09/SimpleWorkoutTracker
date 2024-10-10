import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { UserProvider } from './context/UserContext';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import AppNavbar from './components/AppNavbar';
// import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
// import Logout from './pages/Logout';
import Register from './pages/Register';
import Workouts from './pages/Workout'

function App() {
  const token = localStorage.getItem('token')
  
  return (
    <>
      <Router>
        {/* <AppNavbar /> */}
        <Container>
          <Routes>
            <Route path="/" element={<Workouts />}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register />} />
            {/* <Route path="/logout" element={<Logout />}/> */}
            {/* <Route path="*" element={<ErrorPage />} /> */}
          </Routes>
        </Container>
      </Router>
  </>
  );
}

export default App;
