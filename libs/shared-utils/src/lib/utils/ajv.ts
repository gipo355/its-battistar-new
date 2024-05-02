/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajvInstance = new ajv({
  allErrors: true,
});

addFormats(ajvInstance);

require('ajv-errors')(ajvInstance /*, {singleError: true} */);
require('ajv-keywords')(ajvInstance);

export { ajvInstance };
