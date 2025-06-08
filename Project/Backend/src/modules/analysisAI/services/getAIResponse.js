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

async function getAIResponseMariam(text) {
    try{
        const response= await axios.post('https://9a8c-34-82-98-216.ngrok-free.app/generate',{data:text});
        return response.data
    }catch (error){
        console.error('Error calling AI API:' , error);
        return {error:"AI service unavailable"};
    }
}


export const mariamModel=async(req,res,next)=>{
    const text=req.body;
    console.log(text);
    
    const aiResult= await getAIResponseMariam(text);
    // const analysis= new Analysis({text , result:aiResult});
    // await analysis.save();

    res.json(aiResult);
}

async function getAIResponse2(text) {
    try{
        const response= await axios.post('http://127.0.0.1:5000/generate',{text:text});
        return response.data
    }catch (error){
        console.error('Error calling AI API:' , error);
        return {error:"AI service unavailable"};
    }
}

export const generate=async(req,res,next)=>{
    const {text}=req.body;
    const aiResult= await getAIResponse(text);
    const analysis= new Analysis({text , result:aiResult});
    await analysis.save();

    res.json(aiResult);
}