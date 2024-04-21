import ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajvInstance = new ajv();

addFormats(ajvInstance);

export default ajvInstance;
