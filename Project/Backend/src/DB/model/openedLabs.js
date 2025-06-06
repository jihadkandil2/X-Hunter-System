import mongoose, {Schema , model} from 'mongoose';

const openedLabsSchema= new Schema(
    {
        userId: { type:  Schema.Types.ObjectId,ref:'User' , required: true },
        labs: [{ type: Schema.Types.ObjectId, ref: 'Lab' }]
    },{ timestamps: true }
)

const OpenedLabs= model('OpenedLabs' , openedLabsSchema)|| mongoose.models.OpenedLabs  ;
    


export default OpenedLabs;