import { get } from 'lodash';

// Helper function to ensure the result is always an array
function ensureArray(result: any): any[] {
  if (result === null || result === undefined) {
    return [];
  }
  return Array.isArray(result) ? result : [result];
}

export default function getDataFromPath(data: any, path: string) {
  // Special case for root-level array with [*]
  if (path === '[*]') {
    return Array.isArray(data) ? data : (data ? [data] : []);
  }

  // Pass normal paths directly to Lodash
  if (!path.includes('[*]') && !path.includes(':')) {
    const result = get(data, path);
    return ensureArray(result);
  }

  // For data[*] wildcard
  if (path.includes('[*]')) {
    const basePath = path.split('[*]')[0];
    const restPath = path.split('[*]').slice(1).join('');

    // If basePath is empty (in case path starts with [*])
    if (basePath === '') {
      if (Array.isArray(data)) {
        if (!restPath) return data;

        return data.map(item => {
          if (restPath.startsWith('.')) {
            // If restPath starts with a dot, remove it for the first segment
            const cleanRestPath = restPath.substring(1);
            return get(item, cleanRestPath);
          } else {
            return get(item, restPath);
          }
        });
      }
      // If data is not an array but exists, make it an array
      return data ? [data] : [];
    }

    const array = get(data, basePath);
    if (Array.isArray(array)) {
      // If restPath is empty, return the entire array
      if (!restPath) return array;

      // Otherwise retrieve data for each element with restPath
      return array.map(item => {
        if (restPath.startsWith('.')) {
          // If restPath starts with a dot, remove it
          const cleanRestPath = restPath.substring(1);
          return get(item, cleanRestPath);
        } else {
          const itemData = { temp: item };
          return get(itemData, `temp${restPath}`);
        }
      });
    } else if (array !== null && array !== undefined) {
      // If it's not an array but contains data, treat it as an array with one element
      if (!restPath) return [array];

      const result = restPath.startsWith('.')
        ? get(array, restPath.substring(1))
        : get({ temp: array }, `temp${restPath}`);
      return ensureArray(result);
    }
  }

  // For ranges like data[0:5]
  const rangeMatch = path.match(/\[(\d+):(\d+)\]/);
  if (rangeMatch) {
    const [fullMatch, startStr, endStr] = rangeMatch;
    const start = parseInt(startStr);
    const end = parseInt(endStr);

    const basePath = path.split(fullMatch)[0];
    const restPath = path.split(fullMatch).slice(1).join('');

    // Direct array for root-level range
    if (basePath === '') {
      if (Array.isArray(data)) {
        const slicedArray = data.slice(start, end + 1);
        if (!restPath) return slicedArray;

        return slicedArray.map(item => {
          if (restPath.startsWith('.')) {
            return get(item, restPath.substring(1));
          } else {
            return get(item, restPath);
          }
        });
      }
      return [];
    }

    const array = get(data, basePath);
    if (Array.isArray(array)) {
      const slicedArray = array.slice(start, end + 1);
      if (!restPath) return slicedArray;

      return slicedArray.map(item => {
        if (restPath.startsWith('.')) {
          return get(item, restPath.substring(1));
        } else {
          const itemData = { temp: item };
          return get(itemData, `temp${restPath}`);
        }
      });
    }
  }

  // Fallback to normal get - ensure the result is an array
  const result = get(data, path);
  return ensureArray(result);
}
