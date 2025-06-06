// src/modules/solvedLabs/services/labAnalysis.service.js

import solvedLabs from "../../../DB/model/solvedLabs.model.js";
import Lab from "../../../DB/model/Lab.model.js";
import User from "../../../DB/model/User.model.js";
import openedLabs from "../../../DB/model/openedLabs.js";
import OpenedLabs from "../../../DB/model/openedLabs.js";
const getSolvedLabsByUserId = async (req, res, next) => {
    try {
        let userId = req.user.id;
        let user = await User.findById(userId)

        const allSolvedLabs = await solvedLabs.find({ userId: userId });
        if (!allSolvedLabs || allSolvedLabs[0].labs.length === 0) {
            return res.status(200).json({
                status: "success",
                message: "No labs solved yet",
                totalLastYear: 0,
                totalLastMonth: 0
            });
        }

        const labIds = allSolvedLabs[0].labs.map(entry => entry.lab);
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
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
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

        // here i calculate user level
        const levelMap = {};
        labLevels.forEach(lab => {
            levelMap[lab._id.toString()] = lab.labLevel;
        });

        const opened = await OpenedLabs.findOne({ userId });
        const openedLabIds = new Set((opened?.labs || []).map(id => id.toString()));
        let score = 0;

        for (const entry of labs) {
            let lab = entry.lab;
            const level = levelMap[entry.lab.toString()];
            let baseScore = 0;

            if (level === 'Easy') baseScore = 10;
            else if (level === 'Medium') baseScore = 20;
            else if (level === 'Hard') baseScore = 30;
            const wasOpenedBefore = openedLabIds.has(lab);
            const openPenalty = wasOpenedBefore ? 0 : 5;

            const finalScore = Math.max(0, baseScore - openPenalty);
            score += finalScore;
        };

        let rank = 'Beginner';
        if (score >= 60 && score < 150) rank = 'Intermediate';
        else if (score >= 150 && score < 300) rank = 'Advanced';
        else if (score >= 300) rank = 'Expert';

        // Save and return rank
        user.rank = rank;
        await user.save();

        return res.status(200).json({ status: "success", totalSolvedLabs: total, totalLastMonth, totalLastYear, solvedPercentage: levelPercentages, activityMap, userName: user.name, rank });
    } catch (error) {
        return res.status(500).json({ status: "fail", message: "server error", error: error.message });
    }
};

export default getSolvedLabsByUserId


