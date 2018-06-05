import processResources from '../processResources';
import fromResource from './fromResource';

export default function incrudable(resources, config) {
  return processResources(resources, fromResource, config);
}
