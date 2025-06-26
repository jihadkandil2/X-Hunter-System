import mongoose, {Schema , model} from 'mongoose';

 const labSchema = new Schema(
    {
    labScenario: { type: String, required: true },
    labDescription: { type: String, required: true },//what about this?
    vulnerabilityName: { type: Schema.Types.Mixed, ref: 'Vulnerability' , required:true },
    SolutionSteps: { type: [String], required: false },
    labLevel: { type: String, required: true },
    srcCode: { type: String },
    payloads: { type: [String] },
    liveUrl: { type: String },
    }, { timestamps: true }
)
 const Lab= model('Lab' , labSchema)|| mongoose.models.Lab  ;


export default Lab;

