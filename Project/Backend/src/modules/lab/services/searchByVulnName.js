
import Lab from "../../../DB/model/Lab.model.js"
const getByVulnName = async(req , res , next)=>{
    try {
        const { vuln ,limit } = req.query;
        if (!vuln) return res.status(400).json({ message: "vuln is required" });
        const maxResults = parseInt(limit) > 0 ? parseInt(limit) : 10;
        const labs = await Lab.find({
            vulnerabilityName: { $regex: vuln, $options: "i" },
          }).limit(maxResults);

          if (labs.length === 0) return res.status(404).json({ message: "No labs found" });
          const extractedLabs = labs.map(({_id, labScenario, labDescription,vulnerabilityName, labLevel }) => ({
            _id,
            labScenario,
            labDescription,
            vulnerabilityName,
            labLevel,
        }));
       
          res.status(200).json({extractedLabs})
        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export default getByVulnName;