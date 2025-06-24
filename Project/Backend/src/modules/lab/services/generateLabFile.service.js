import fs from 'fs';
import path from 'path';
import Lab from '../../../DB/model/Lab.model.js';

const generateLabFiles = async (labId , port) => {
  const lab = await Lab.findById(labId);
  if (!lab) throw new Error('Lab not found');

  const labDir = path.resolve('GeneratedLabs', `lab_${labId}`);
  if (!fs.existsSync(labDir)) {
    fs.mkdirSync(labDir, { recursive: true });
  }

  // Save srcCode to file
  const filePath = path.join(labDir, 'index.cjs');
//   fs.writeFileSync(filePath, lab.srcCode, 'utf8');

// const customizedSrcCode = lab.srcCode.replace('{{PORT}}', port);
const customizedSrcCode = lab.srcCode.replace(3000, port);
fs.writeFileSync(filePath, customizedSrcCode, 'utf8');


  return { folderPath: labDir, filePath };
};

export default generateLabFiles;
