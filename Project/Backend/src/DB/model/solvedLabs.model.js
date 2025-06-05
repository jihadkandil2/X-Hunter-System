import mongoose, {Schema , model} from 'mongoose';

const solvedLabsSchema= new Schema(
    {
        userId: { type:  Schema.Types.ObjectId,ref:'User' , required: true },
        labs: [  {lab:{ type: Schema.Types.ObjectId, ref: 'Lab' } , solvedAt:{type:Date , default:Date.now()}}]
    },{ timestamps: true }
)

const solvedLabs= model('solvedLabs' , solvedLabsSchema)|| mongoose.models.solvedLabs  ;
    


export default solvedLabs;