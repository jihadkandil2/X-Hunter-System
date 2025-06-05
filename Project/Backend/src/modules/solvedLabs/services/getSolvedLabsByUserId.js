// src/modules/solvedLabs/services/labAnalysis.service.js

import solvedLabs from "../../../DB/model/solvedLabs.model.js";
import Lab from "../../../DB/model/Lab.model.js";
import User from "../../../DB/model/User.model.js";
const getSolvedLabsByUserId = async (req, res, next) => {
    try {
        let userId = req.user.id;
        let user = await User.findById(userId)

        const allSolvedLabs = await solvedLabs.find({ userId: userId });
        console.log(allSolvedLabs);
        
        if (!allSolvedLabs || allSolvedLabs[0].labs.length === 0) {
            return res.status(200).json({
                status: "success",
                message: "No labs solved yet",
                totalLastYear: 0,
                totalLastMonth: 0
            });
        }

        const labIds = allSolvedLabs[0].labs.map(entry => entry.lab);
        console.log(labIds);


        const labLevels = await Lab.find(
            { _id: { $in: labIds } },
            { labLevel: 1 }
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

        const now = new Date();   // 2025-06-04T12:00:00.000Z (example)
        console.log(now);
        
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        console.log(oneYearAgo , '  ' , oneMonthAgo);
        
        const labs = allSolvedLabs[0].labs;
        const labsLastYear = labs.filter(entry => entry.solvedAt >= oneYearAgo);
        const labsLastMonth = labs.filter(entry => entry.solvedAt >= oneMonthAgo);
        const totalLastYear = labsLastYear.length;
        const totalLastMonth = labsLastMonth.length;

        const activityMap = {};
        labs.forEach(entry => {
  const day = entry.solvedAt.toISOString().split('T')[0]; // e.g., "2025-06-05"
  activityMap[day] = (activityMap[day] || 0) + 1;
});


        return res.status(200).json({ status: "success", totalSolvedLabs: total , totalLastMonth , totalLastYear , solvedPercentage: levelPercentages,activityMap, userName: user.name });
    } catch (error) {
        return res.status(500).json({ status: "fail", message: "server error", error:error.message });
    }
};

export default getSolvedLabsByUserId


