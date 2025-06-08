
import axios from "axios";
import { Router } from "express";

let router = Router()
///generate-lab

const asmaaModel= async (req, res) => {
    console.log('entered');
    
    const AI_MODEL_URL = "https://8855-34-34-83-77.ngrok-free.app/generate";
  const { Lab_scenario, Lab_Description, Difficulty_Level, Vulnerability_name } = req.body;

  try {
    const response = await axios.post(AI_MODEL_URL, {
      Lab_scenario,
      Lab_Description,
      Difficulty_Level,
      Vulnerability_name
    });

    const code = response.data.code;

    if (response.data.success && code) {
      // Clean triple backticks if needed
      const cleanedCode = code.replace(/```[a-z]*\n?/g, '').replace(/```$/, '');
      res.json({ success: true, srcCode: cleanedCode });
    } else {
      res.status(500).json({ success: false, error: response.data.error || 'Failed to generate code.' });
    }
  } catch (error) {
    console.error("Error calling AI model:", error.message);
    res.status(500).json({ success: false, error: "AI model service failed." });
  }
};

export default asmaaModel;
