// import axios from "axios";

// const krkrModel= async (req, res) => {
//   try {
//     const response = await axios.post('http://abc123.ngrok.io/generate_payloads', {
//       lab_input: labInput
//     });

//     console.log("Received payload from Flask:", response.data.payloads);
//     return response.data.payloads;

//   } catch (error) {
//     console.error("Error communicating with Flask:", error.message);
//     throw error;
//   }
// }

// // Example usage
// export default krkrModel


import axios from "axios";
import { Router } from "express";

let router = Router()
///generate-lab

// const krkrModel= async (req, res) => {
//     console.log('entered');
    
//     const AI_MODEL_URL = "https://0940-34-125-84-155.ngrok-free.app/generate_payloads";
//   const { labInput } = req.body;
//   console.log('labInput' , labInput);
  

//    try {
//     const response = await axios.post(AI_MODEL_URL, {
//       lab_input: labInput
//     });

//     console.log("Received payload from Flask:", response.data.payloads);
//     if(response.data.payloads){
//         return res.json({ success: true, payloads: response.data.payloads });
//     }
//     // return response.data.payloads;

//   } catch (error) {
//     console.error("Error communicating with Flask:", error.message);
//     throw error;
//   }
// };




const krkrModel= async (body) => {
    console.log('entered');
    
    const AI_MODEL_URL = "https://7fee-34-125-184-214.ngrok-free.app/generate_payloads";
  const Lab_Description = body["Description"];
    const Difficulty_Level = body["Difficulty Level"];
    const Lab_scenario = body["Lab Scenario"];
    const Vulnerability_name = body["Vulnerability name"];
  
    const labInput=`Scenario: ${Lab_scenario}. Description: ${Lab_Description} Difficulty: ${Difficulty_Level}.Vulnerability${Vulnerability_name}`
    console.log('labInput : ',labInput);
    
   try {
    const response = await axios.post(AI_MODEL_URL, {
      lab_input: labInput
    });
    // console.log('response from krkr : ' , response);
    

    console.log("Received payload from Flask:", response.data.payloads);
    if(response.data.payloads){
        return response.data.payloads
    }
    

  } catch (error) {
    console.error("Error communicating with Flask:", error.message);
    throw error;
  }
};

export default krkrModel;


