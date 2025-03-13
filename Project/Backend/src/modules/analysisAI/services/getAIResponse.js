import axios from "axios";
// import analysisModel from '../../../DB/model/analysisAI.js'
import Analysis from "../../../DB/model/analysisAI.js";

async function getAIResponse(text) {
    try{
        const response= await axios.post('http://localhost:5000/predict',{text:text});
        return response.data
    }catch (error){
        console.error('Error calling AI API:' , error);
        return {error:"AI service unavailable"};
    }
}

export const analyze=async(req,res,next)=>{
    const {text}=req.body;
    const aiResult= await getAIResponse(text);
    const analysis= new Analysis({text , result:aiResult});
    await analysis.save();

    res.json(aiResult);
}