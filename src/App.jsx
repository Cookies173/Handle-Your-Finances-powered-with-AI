import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import ProtectedRoutes from "./components/routes/Authentication/ProtectedRoutes.jsx";
import Home from "./components/routes/Home/Home.jsx"
import Login from "./components/routes/Authentication/Login.jsx";
import Register from "./components/routes/Authentication/Register.jsx";
import Dashboard from "./components/routes/Dashboard/Dashboard.jsx";
import PageNotFound from "./components/routes/Authentication/PageNotFound.jsx";
import Account from "./components/routes/Account/Account.jsx";
import AddTransaction from "./components/routes/AddTransaction/AddTransaction.jsx";

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account/:id" element={<Account />} />
          <Route path="transaction/create" element={<AddTransaction />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
