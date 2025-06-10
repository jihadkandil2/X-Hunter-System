
import axios from "axios";
import { Router } from "express";

let router = Router()
// ///generate-lab

// const asmaaModel= async (req, res) => {
//     console.log('entered');
    
//     const AI_MODEL_URL = "https://2582-34-53-115-32.ngrok-free.app/generate";
//   const {vulnName} = req.body;
//   console.log(vulnName);
  

//   try {
//     const response = await axios.post(AI_MODEL_URL, vulnName ,{
//       headers: {
//         "Content-Type": "text/plain"
//       }
//     });
//     console.log('response : ' , response);
//     return res.json({response})

//     // const code = response.data.code;

//     // if (response.data.success && code) {
//     //   // Clean triple backticks if needed
//     //   const cleanedCode = code.replace(/```[a-z]*\n?/g, '').replace(/```$/, '');
//     //   res.json({ success: true, srcCode: cleanedCode });
//     // } else {
//     //   res.status(500).json({ success: false, error: response.data.error || 'Failed to generate code.' });
//     // }
//   } catch (error) {
//     console.error("Error calling AI model:", error.message);
//     res.status(500).json({ success: false, error: "AI model service failed." });
//   }
// };

// export default asmaaModel;


const asmaaModel = async (req, res) => {
  console.log('Entered asmaaModel controller');

  const AI_MODEL_URL = "https://2582-34-53-115-32.ngrok-free.app/generate";
  const { vulnName } = req.body;

  if (!vulnName) {
    return res.status(400).json({ success: false, error: "Missing 'vulnName' in request body." });
  }

  try {
    const response = await axios.post(AI_MODEL_URL, vulnName, {
      headers: {
        "Content-Type": "text/plain"
      }
    });

    console.log('AI Model Response:', response.data);

    // Return just the useful data
    return res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error("Error calling AI model:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch lab from AI model."
    });
  }
};


export default asmaaModel;