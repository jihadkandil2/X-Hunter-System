import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Labdetails from "../Labdetails/Labdetails";
import "../Homepage/Homepage.css";

function FullLabPage() {
  const location = useLocation();
  const {
    labScenario = "Default Lab Scenario",
    labLevel = "Default Lab Level",
    labDescription = "Default lab description.",
    srcCode = "",
    vulnerabilityName="",
    SolutionSteps = [],
  } = location.state || {};

  return (
    <div className="homepage-background min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center pt-8 z-10">
        <Labdetails
          labScenario={labScenario}
          labLevel={labLevel}
          labDescription={labDescription}
          srcCode={srcCode}
          SolutionSteps={SolutionSteps}
          vulnerabilityName={vulnerabilityName}
        />
      </div>
    </div>
  );
}

export default FullLabPage;
