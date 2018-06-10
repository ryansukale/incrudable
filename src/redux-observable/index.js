import processResources from '../processResources';
import generateEpic from './generateEpic';

export default function incrudable(resources, config) {
  return processResources(generateEpic, resources, config);
}
