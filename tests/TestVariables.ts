import * as path from 'path';
import * as fs from 'fs';

const SAMPLES_FOLDER = path.resolve(__dirname, '../samples');
const OUTPUT_SAMPLES_FOLDER = path.resolve(__dirname, '../samples/out');
const OUTPUT_SINGLE_CASES_FOLDER = path.resolve(__dirname, '../samples/out/single_cases');
const OUTPUT_SVG_FOLDER = path.resolve(__dirname, '../samples/out/svg');

export const TestVariables = {
  decimalPrecision: 5,
  delta: 0.00001,
  localEnv: true,
  samplesFolder: SAMPLES_FOLDER,
  outputSamplesFolder: OUTPUT_SAMPLES_FOLDER,
  outputSingleCasesFolder: OUTPUT_SINGLE_CASES_FOLDER,
  outputSvgFolder: OUTPUT_SVG_FOLDER,
  savePreview: false,
  selfCheckOutput: true,

  createOutputFolders(): void {
    for (const dir of [OUTPUT_SAMPLES_FOLDER, OUTPUT_SINGLE_CASES_FOLDER, OUTPUT_SVG_FOLDER]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  },
};
