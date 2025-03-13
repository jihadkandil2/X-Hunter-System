import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Landpage from "./Components/Landpage/Landpage";
import Login from "./Components/Login/Login";
import HomePage from "./Components/Homepage/Homepage";
import Register from "./Components/Register/Register";

function App() {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<Landpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
