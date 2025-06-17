import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import ProtectedRoutes from "./components/routes/Authentication/ProtectedRoutes.jsx";
import Home from "./components/routes/Home/Home.jsx"
import Login from "./components/routes/Authentication/Login.jsx";
import Register from "./components/routes/Authentication/Register.jsx";
import Dashboard from "./components/routes/Dashboard/Dashboard.jsx";

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
