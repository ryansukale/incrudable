import { combineEpics } from 'redux-observable';

import processResources from '../processResources';
import generateThunk from './generateThunk';
import fromResource from './fromResource';


export default function incrudable(resources, config) {
  const sources = processResources(generateThunk, resources, config);

  const epics = Object.keys(sources).map(resourceName => sources[resourceName].epic);
  sources.epic = combineEpics(...epics);

  return sources;
}

incrudable.fromResource = fromResource;
