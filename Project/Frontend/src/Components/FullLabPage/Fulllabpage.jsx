// FullLabPage.js
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Labdetails from "../Labdetails/Labdetails";

function FullLabPage() {
  const location = useLocation();
  const { labScenario, labLevel, labDescription } = location.state || {
    labScenario: "Default Lab Scenario",
    labLevel: "Default Lab Level",
    labDescription: "Default lab description.",
  };

  return (
    <div className="h-screen bg-[#000820] flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <Labdetails labScenario={labScenario} labLevel={labLevel} labDescription={labDescription} />
      </div>
    </div>
  );
}

export default FullLabPage;