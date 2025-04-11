import _ from 'lodash';

/**
 * Process various JSONPath notations
 */
export default function processJsonPath(path: string, value: any): Record<string, any> {
  // Root level array with wildcard
  if (path === '[*]') {
    return [value]; // Return direct array
  }

  // Check for wildcard notation inside properties
  if (path.includes('[*]')) {
    const pathParts = path.split('.');
    const result = {};

    // Handle each path segment
    let current = result;
    let lastProp = '';

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];

      if (part.includes('[*]')) {
        // This part has a wildcard array
        const propName = part.split('[')[0];
        lastProp = propName;

        if (i === pathParts.length - 1) {
          // If it's the last part, set the array with value
          current[propName] = [value];
        } else {
          // If not last, create empty array with object
          current[propName] = [{}];
          current = current[propName][0];
        }
      } else {
        // Regular property
        if (i === pathParts.length - 1) {
          // Last part, set value
          current[part] = value;
        } else {
          // Not last, create empty object
          current[part] = {};
          current = current[part];
          lastProp = part;
        }
      }
    }

    return result;
  }

  // For regular paths without wildcards
  const result = {};
  _.set(result, path, value);
  return result;
}
