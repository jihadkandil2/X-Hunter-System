import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Labitem from "../Labitem/labitem";
import "./Homepage.css";

function Homepage() {
  const [vulns, setVulns] = useState([]);
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    axios
      .get("http://localhost:3000/labs/all")
      .then((res) => {
        const newData = res.data.vulns;
console.log(res);
        if (newData && newData.length > 0) {
          const stored = localStorage.getItem("vulns");
          const parsedStored = stored ? JSON.parse(stored) : [];

          const isDifferent =
            parsedStored.length !== newData.length ||
            JSON.stringify(parsedStored) !== JSON.stringify(newData);

          if (isDifferent) {
            localStorage.setItem("vulns", JSON.stringify(newData));
            console.log("✅ LocalStorage updated with new data");
          } else {
            console.log("⚠️ No changes detected. LocalStorage remains the same.");
          }

          setVulns(newData);
          setSelectedVuln(newData[0]);
        }
      })
      .catch((err) =>
        console.error("❌ Error fetching vulnerabilities:", err)
      );
  }, []);

  const handleVulnClick = (vuln) => {
    setSelectedVuln(vuln);
    const el = document.getElementById(`vuln-${vuln._id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="homepage-background min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-1/5" : "w-16"
          } bg-[#0C1317] sticky top-0 h-screen overflow-y-auto transition-all duration-300`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            vulns={vulns}
            onVulnClick={handleVulnClick}
          />
        </div>

        {/* Main Content */}
        <div
          className="flex-1 p-3 overflow-visible"
          style={{ position: "relative", zIndex: 1 }}
        >
          {vulns.length > 0 ? (
            vulns.map((vuln) => (
              <div
                key={vuln._id}
                id={`vuln-${vuln._id}`}
                className="mb-10 relative"
              >
                <h3
                  className={`text-white text-2xl mb-4 ${
                    selectedVuln?._id === vuln._id
                      ? "sticky top-0 py-4 z-[5]"
                      : ""
                  }`}
                >
                  {vuln.name}
                </h3>
                {vuln.labs?.length > 0 ? (
                  vuln.labs.map((lab) => (
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
                  <p className="text-white">
                    No labs available for this vulnerability.
                  </p>
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
