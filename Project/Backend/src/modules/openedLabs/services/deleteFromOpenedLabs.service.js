import OpenedLabs from "../../../DB/model/openedLabs.js";
import Lab from "../../../DB/model/Lab.model.js";
const deleteOpenedLab=async (req , res , next)=>{
    try {
        const userId=req.user.id;
        const labId = req.params.labId;
        console.log(labId);
        
         const checkLab = await Lab.findById(labId);
            if (!checkLab) {
              return res.status(404).json({status:'fail' , message:'lab not found!!'})
            }

           const opened = await OpenedLabs.findOne({ userId });
        if (!opened || !opened.labs.includes(labId)) {
      return res.status(400).json({
        status: "fail",
        message: "This lab is not in your opened labs.",
      });
    }

    const updated = await OpenedLabs.findOneAndUpdate(
      { userId },
      { $pull: { labs: labId } },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Lab removed successfully from opened labs.",
      openedLab: updated,
    });
      

    } catch (error) {
        return res.status(500).json({status:'fail' , message:error.message})
    }
}

export default deleteOpenedLab;