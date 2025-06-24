
import axios from "axios";
import { Router } from "express";
import mariamModel from "./mariam.model.js";
import krkrModel from "./krkr.model.js";
let router = Router()

export const asmaaModel = async (req, res) => {
  console.log('Entered asmaaModel controller');

  const AI_MODEL_URL = "https://3f0f-34-125-158-47.ngrok-free.app/generate";
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
    const asmaaResponse=response.data;
    // mariamModel(asmaaResponse)
   const krkrOutput=await krkrModel(asmaaResponse)
    console.log('output from krkr' , krkrOutput );
    


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



// export default asmaaModel;