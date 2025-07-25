import React from "react";
import { Routes, Route } from "react-router-dom";
import Landpage from "./Components/Landpage/Landpage";
import Login from "./Components/Login/Login";
import HomePage from "./Components/Homepage/Homepage";
import Register from "./Components/Register/Register";
import FullLabPage from "./Components/FullLabPage/Fulllabpage";
import UpdateAccount from "./Components/Updatepage/Updatepage";
import DeleteAccount from "./Components/Deletepage/Deletepage";
import AboutUs from "./Components/Aboutus/Aboutus";
import AdminChat from "./Components/Adminchat/Adminchat";
import ManageLabs from "./Components/Mangelabs/Managelabs";
import EditLabs from "./Components/Editlabs/Editlabs";
import Dashboard from "./Components/Dashboard/Dashboard";
import Userdash from "./Components/Userdash/Userdash";
import Openedlabs from "./Components/Openedlabs/Openedlabs";

function App() {
  const role = localStorage.getItem("role");

  return (
    <>
      <Routes>
        <Route path="/" element={<Landpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/fullLab" element={<FullLabPage />} />
        <Route path="/update-account" element={<UpdateAccount />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/generate-labs" element={<AdminChat />} />
        <Route path="/manage-labs" element={<ManageLabs />} />
        <Route path="/edit-lab/:id" element={<EditLabs />} />
        <Route path="/labs/opened" element={<Openedlabs />} />
        <Route
          path="/dashboard"
          element={role === "admin" ? <Dashboard /> : <Userdash />}
        />
      </Routes>
    </>
  );
}

export default App;
