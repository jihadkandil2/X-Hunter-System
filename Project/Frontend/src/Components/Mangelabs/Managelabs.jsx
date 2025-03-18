import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ استيراد useNavigate
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Managelabs.css";

const ManageLabs = () => {
  const [labs, setLabs] = useState([]);
  const navigate = useNavigate(); // ⬅️ تعريف useNavigate

  useEffect(() => {
    axios
      .get("http://localhost:3000/labs/all")
      .then(response => setLabs(response.data.labs))
      .catch((err) => console.error("Error fetching vulnerabilities:", err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lab?")) {
      axios.delete(`http://localhost:3000/labs/${id}`)
        .then(() => setLabs(labs.filter(lab => lab._id !== id)))
        .catch(error => console.error("Error deleting lab:", error));
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-lab/${id}`); 
  };

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="centered-container">
        <h2 className="main-title">Manage All Labs</h2>
        
        <table className="labs-table">
          <thead>
            <tr>
              <th>Vulnerability Name</th>
              <th>Description</th>
              <th>Scenario</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab._id}>
                <td>{lab.vulnerabilityName}</td>
                <td>{lab.labDescription}</td>
                <td>{lab.labScenario}</td>
                <td>{lab.labLevel}</td>
                <td>
                  <div className="button-group">
                    <button className="edit-btn" onClick={() => handleEdit(lab._id)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(lab._id)}>
                      Delete
                    </button>
                  </div>
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
