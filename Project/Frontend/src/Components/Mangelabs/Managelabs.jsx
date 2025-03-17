import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Managelabs.css";

const ManageLabs = () => {
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/labs/getByVulnName")
      .then(response => setLabs(response.data))
      .catch(error => console.error("Error fetching labs:", error));
  }, []);

  const handleDelete = (_id) => {
    axios.delete(`https://api.example.com/labs/${_id}`)
      .then(() => setLabs(labs.filter(lab => lab._id !== _id)))
      .catch(error => console.error("Error deleting lab:", error));
  };

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="centered-container">
        <h2 className="main-title">Manage All Labs</h2>
        
        <table className="labs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vulnerability</th>
              <th>Description</th>
              <th>Scenario</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab._id}>
                <td>{lab._id}</td>
                <td>{lab.vulnerabilityName}</td>
                <td>{lab.labDescription}</td>
                <td>{lab.labScenario}</td>
                <td>{lab.labLevel}</td>
                <td>
                  <button className="edit-btn" onClick={() => console.log("Edit", lab.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(lab._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLabs;