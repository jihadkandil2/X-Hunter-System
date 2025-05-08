
import { getSolvedLabLevelStats } from "../services/utility.service.js";

const getAllSolvedLabs = async (req, res, next) => {
  try {
    const stats = await getSolvedLabLevelStats();
    return res.status(200).json({ status: "success", ...stats });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: "server error", error });
  }
};

export default getAllSolvedLabs;
