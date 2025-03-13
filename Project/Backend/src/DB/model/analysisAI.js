import mongoose, {Schema , model} from 'mongoose';
const AnalysisSchema = new Schema({
    text:String,
    result:Object,
    createdAt:{type:Date , default:Date.now}
});

const Analysis=model('Analysis', AnalysisSchema)
export default Analysis;