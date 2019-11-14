import { getConfig } from '../../config';

export function createConfigFileData(answers) {
  const { configFileType, docFileType } = answers
  let data = getConfig(configFileType);
  data["fileExtension"] = docFileType.split(' ')[1]
  return data;
}