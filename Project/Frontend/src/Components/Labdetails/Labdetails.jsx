import React, { useState } from "react";
import "./Labdetails.css"
function Labdetails({ labScenario, labLevel, labDescription, srcCode, SolutionSteps ,vulnerabilityName}) {
  const [showSteps, setShowSteps] = useState(false);

const handleAccessLab = () => {
  const blob = new Blob(
    [srcCode],
    { type: "text/html" }
  );

  const url = URL.createObjectURL(blob);
  const win = window.open();
  win.document.write(`
    <html>
      <head>
        <title>Lab</title>
        <style>
          body {
            margin: 0;
            padding: 0;
          }
          iframe {
            width: 100vw;
            height: 100vh;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="${url}" sandbox="allow-scripts allow-forms allow-same-origin"></iframe>
      </body>
    </html>
  `);
  win.document.close();
};



  return (
    <div className="mx-auto mt-0 mb-8 w-[70%] labdetails-color text-white p-8 rounded-xl shadow-lg flex flex-col items-center">
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold">Lab :{vulnerabilityName}</h2>
        <p className="text-l font-normal">{labScenario}</p>
        <h2 className="text-2xl font-bold">Description :</h2>
        <p className="text-l font-normal">{labDescription}</p>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleAccessLab}
          className="bg-[#5DB717] hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full"
        >
          Access The Lab
        </button>
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="bg-[#5DB717] hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full"
        >
          Solution!
        </button>
      </div>

      {showSteps && (
        <div className="mt-6 bg-[#0b0f12] p-4 w-full rounded border border-gray-700">
          <h3 className="font-semibold mb-2">Sol Steps:</h3>
          <ul className="list-decimal pl-5 space-y-1">
            {SolutionSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Labdetails;
