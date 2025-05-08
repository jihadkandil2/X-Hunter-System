import mongoose, {Schema , model} from 'mongoose';

const solvedLabsSchema= new Schema(
    {
        userId: { type:  Schema.Types.ObjectId,ref:'User' , required: true },
        labs: [{ type: Schema.Types.ObjectId, ref: 'Lab' }]
    },{ timestamps: true }
)

const solvedLabs= model('solvedLabs' , solvedLabsSchema)|| mongoose.models.solvedLabs  ;



export default solvedLabs;