import processResources from '../lib/processResources';
import fromResource from './fromResource';

export fromResource;

export default function incrudable(resources) {
  return processResources(resources, fromResource);
}
