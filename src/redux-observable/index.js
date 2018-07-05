import processResources from '../processResources';
import generateEpic from './generateEpic';
import fromResource from './fromResource';

export default function incrudable(resources, config) {
  return processResources(generateEpic, resources, config);
}

incrudable.fromResource = fromResource;
