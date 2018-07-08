import processResources from '../processResources';
import generateThunk from './generateThunk';
import fromResource from './fromResource';

export default function incrudable(resources, config) {
  return processResources(generateThunk, resources, config);
}

incrudable.fromResource = fromResource;
