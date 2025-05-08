// src/modules/solvedLabs/services/labAnalysis.service.js

import solvedLabs from "../../../DB/model/solvedLabs.model.js";
import Lab from "../../../DB/model/Lab.model.js";

export const getSolvedLabLevelStats = async () => {
  const allSolvedLabs = await solvedLabs.find();

  const labIdSet = new Set();
  for (const doc of allSolvedLabs) {
    doc.labs.forEach(labId => labIdSet.add(labId.toString()));
  }
  const uniqueLabIds = [...labIdSet];

  const labLevels = await Lab.find(
    { _id: { $in: uniqueLabIds } },
    { labLevel: 1, _id: 0 }
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

  return {
    totalSolvedLabs: total,
    solvedPercentage:levelPercentages,
  };
};
