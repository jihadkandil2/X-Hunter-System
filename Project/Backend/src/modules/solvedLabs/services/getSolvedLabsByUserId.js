// src/modules/solvedLabs/services/labAnalysis.service.js

import solvedLabs from "../../../DB/model/solvedLabs.model.js";
import Lab from "../../../DB/model/Lab.model.js";
import User from "../../../DB/model/User.model.js";
 const getSolvedLabsByUserId = async (req , res,next) => {
try {
       let userId=req.user.id;
       let user= await User.findById(userId)
       console.log(user);
       
  const allSolvedLabs = await solvedLabs.find({userId:userId});

  const labLevels = await Lab.find(
    { _id: { $in: allSolvedLabs[0].labs } },
    { labLevel: 1}
  );

  
  const levelCount = {};
  labLevels.forEach(lab => {
    const level = lab.labLevel;
    levelCount[level] = (levelCount[level] || 0) + 1;
  });

  const levelPercentages = {};
  const total = labLevels.length;
  for (const [level, count] of Object.entries(levelCount)) {
    levelPercentages[level] = ((count / total) * 100).toFixed(2) + '%';
  }

   return res.status(200).json({ status: "success",totalSolvedLabs: total,solvedPercentage:levelPercentages , userName:user.name });
} catch (error) {
   return res.status(500).json({ status: "fail", message: "server error", error });
}
};

export default getSolvedLabsByUserId


