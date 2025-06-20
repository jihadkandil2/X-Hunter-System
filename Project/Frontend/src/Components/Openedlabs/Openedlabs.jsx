import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Labitem from "../Labitem/labitem";
import "../Homepage/Homepage.css";

function Openedlabs() {
  const [openedLabs, setOpenedLabs] = useState([]);

  useEffect(() => {
    const fetchOpenedLabs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/opened/getByUserId", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Opened Labs:", res.data.openedLabs);
        setOpenedLabs(res.data.openedLabs || []);
      } catch (err) {
        console.error("❌ Error fetching opened labs:", err);
        setOpenedLabs([]); // fallback empty
      }
    };

    fetchOpenedLabs();
  }, []);

  return (
    <div className="homepage-background min-h-screen flex flex-col">
      <Navbar />
      <div className="flex centre">
      <div className="flex flex-1 relative ">
        <div className="flex-1 p-3 overflow-visible" style={{ zIndex: 1 }}>
          <h2 className="text-white text-2xl font-bold mb-6">Opened Labs :</h2>
          {openedLabs.length > 0 ? (
            openedLabs.map((lab) => (
              <Labitem
                key={lab._id}
                labLevel={lab.labLevel}
                labScenario={lab.labScenario}
                labDescription={lab.labDescription}
                solved={lab.solved || false}
                srcCode={lab.srcCode}
                SolutionSteps={lab.SolutionSteps}
                vulnerabilityName={lab.vulnerabilityName}
              />
            ))
          ) : (
            <p className="text-white">No opened labs found.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Openedlabs;
