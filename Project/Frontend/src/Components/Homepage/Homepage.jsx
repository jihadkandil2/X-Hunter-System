import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Labitem from "../Labitem/labitem";

function Homepage() {
  const [vulns, setVulns] = useState([]);
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  useEffect(() => {
    axios
      .get("http://localhost:3000/labs/all")
      .then((res) => {
        console.log(res);
        
        if (res.data.vulns && res.data.vulns.length > 0) {
          setVulns(res.data.vulns);
          setSelectedVuln(res.data.vulns[0]);
        }
      })
      .catch((err) => console.error("Error fetching vulnerabilities:", err));
  }, []);

  const handleVulnClick = (vuln) => {
    setSelectedVuln(vuln);
    const el = document.getElementById(`vuln-${vuln._id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#000820] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? "w-1/5" : "w-16"} bg-[#0b132b]`}>
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            vulns={vulns}
            onVulnClick={handleVulnClick}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#000820]">
          {vulns.length > 0 ? (
            vulns.map((vuln) => (
              <div key={vuln._id} id={`vuln-${vuln._id}`} className="mb-8">
                <h3 className="text-white text-2xl mb-4">{vuln.name}</h3>
                {vuln.labs && vuln.labs.length > 0 ? (
                  vuln.labs.map((lab, idx) => (
                    <Labitem
                      key={lab._id}
                      labLevel={lab.labLevel}
                      labScenario={lab.labScenario}
                      labDescription={lab.labDescription}
                      solved={lab.solved || false}
                    />
                  ))
                ) : (
                  <p className="text-white">No labs available for this vulnerability.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-white">No vulnerabilities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;