import fromResource from '../fromResource';
import generateThunk from './generateThunk';

export default fromResource.bind(null, generateThunk);
