import processResources from '../processResources';
import generateThunk from './generateThunk';

export default function incrudable(resources, config) {
  return processResources(generateThunk, resources, config);
}
