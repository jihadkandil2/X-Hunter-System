
import axios from "axios";
import { Router } from "express";
import {asmaaModel} from "./asmaa.model.js";
let router = Router()

// const mariamModel= async (req, res) => {
//     console.log('entered');

    
    
//     const AI_MODEL_URL = "https://4436-34-34-7-132.ngrok-free.app/generate";
//   const { Lab_scenario, Lab_Description, Difficulty_Level, Vulnerability_name } = req.body;
//   console.log({Lab_scenario, Lab_Description, Difficulty_Level, Vulnerability_name});
  

//   try {
//     const response = await axios.post(AI_MODEL_URL, {
//       Lab_scenario,
//       Lab_Description,
//       Difficulty_Level,
//       Vulnerability_name
//     });
//     console.log('response :' , response);
    
//     const code = response.data.code;

//     if (response.data.success && code) {
//       // Clean triple backticks if needed
//       const cleanedCode = code.replace(/```[a-z]*\n?/g, '').replace(/```$/, '');
//       res.json({ success: true, srcCode: cleanedCode });
//     } else {
//       res.status(500).json({ success: false, error: response.data.error || 'Failed to generate code.' });
//     }
//   } catch (error) {
//     console.error("Error calling AI model:", error.message);
//     res.status(500).json({ success: false, error: "AI model service failed." });
//   }
// };


const mariamModel= async (body) => {
    console.log('entered');
    const AI_MODEL_URL = "https://e03b-34-125-124-65.ngrok-free.app/generate";
    const Lab_Description = body["Description"];
    const Difficulty_Level = body["Difficulty Level"];
    const Lab_scenario = body["Lab Scenario"];
    const Vulnerability_name = body["Vulnerability name"];
    console.log({Lab_Description , Difficulty_Level , Lab_scenario , Vulnerability_name});

  try {
    const response = await axios.post(AI_MODEL_URL, {
      Lab_scenario,
      Lab_Description,
      Difficulty_Level,
      Vulnerability_name
    });
    console.log('response from mariam : ' , response);
    

    const code = response.data.code;

    if (response.data.success && code) {
      // Clean triple backticks if needed
      const cleanedCode = code.replace(/```[a-z]*\n?/g, '').replace(/```$/, '');
      console.log('mariam output: ' , cleanedCode);
      return cleanedCode
      
      // res.json({ success: true, srcCode: cleanedCode });
    } else {
      return console.error( response.data.error || 'Failed to generate code.')
      // res.status(500).json({ success: false, error: response.data.error || 'Failed to generate code.' });
    }
  } catch (error) {
    console.error("Error calling AI model:", error.message);
    // res.status(500).json({ success: false, error: "AI model service failed." });
  }
};

export default mariamModel;
