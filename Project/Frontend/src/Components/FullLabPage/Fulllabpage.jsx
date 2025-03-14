import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Labdetails from "../Labdetails/Labdetails";


function FullLabPage() {
    

  const location = useLocation();
  const { labScenario, labLevel, description } = location.state || {
    labScenario: "Default Lab Scenario",
    labLevel: "Default Lab Level",
    description: "Default lab description.",
  };

  const handleAccess = () => {
    // You can perform further actions here if needed.
    console.log("Access Lab button clicked.");
  };

  return (
    <div className="h-screen bg-[#000820] flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <Labdetails
          labScenario={labScenario}
          labLevel={labLevel}
          description={description}
          onAccess={handleAccess}
        />
      </div>
    </div>
  );
}

export default FullLabPage;
