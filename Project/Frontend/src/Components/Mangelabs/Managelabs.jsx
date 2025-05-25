import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ استيراد SweetAlert2
import Navbar from "../Navbar/Navbar";
import "./Managelabs.css";
import "../Homepage/Homepage.css"
import Adminside from "../Adminside/Adminside";
const ManageLabs = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/labs/all")
      .then(response => {
        setLabs(response.data.labs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vulnerabilities:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D3044", // ✅ لون الزر الأساسي
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/labs/${id}`)
          .then(() => {
            setLabs(labs.filter(lab => lab._id !== id));
            Swal.fire({
              title: "Deleted!",
              text: "The lab has been deleted.",
              icon: "success",
              confirmButtonColor: "#1D3044", // ✅ تغيير لون زر OK
            });
          })
          .catch(error => console.error("Error deleting lab:", error));
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/edit-lab/${id}`);
  };

  return (
    <div className=" homepage-background page-container ">
      <Adminside />
      
      <div className="centered-container">
        <h2 className="main-title">Manage All Labs</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="text-white">Loading labs...</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ManageLabs;
