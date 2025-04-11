import { get } from 'lodash';

export default function getDataFromPath(data: any, path: string) {
  // Speciale case voor root-level array met [*]
  if (path === '[*]') {
    return Array.isArray(data) ? data : [];
  }

  // Normale paden direct doorgeven aan Lodash
  if (!path.includes('[*]') && !path.includes(':')) {
    return get(data, path);
  }

  // Voor data[*] wildcard
  if (path.includes('[*]')) {
    const basePath = path.split('[*]')[0];
    const restPath = path.split('[*]').slice(1).join('');

    // Als basePath leeg is (voor het geval dat path begint met [*])
    if (basePath === '') {
      if (Array.isArray(data)) {
        if (!restPath) return data;

        return data.map(item => {
          if (restPath.startsWith('.')) {
            // Als restPath begint met een punt, verwijder deze voor het eerste segment
            const cleanRestPath = restPath.substring(1);
            return get(item, cleanRestPath);
          } else {
            return get(item, restPath);
          }
        });
      }
      return [];
    }

    const array = get(data, basePath);
    if (Array.isArray(array)) {
      // Als restPath leeg is, geef de hele array terug
      if (!restPath) return array;

      // Anders haal data op voor elk element met restPath
      return array.map(item => {
        if (restPath.startsWith('.')) {
          // Als restPath begint met een punt, haal deze weg
          const cleanRestPath = restPath.substring(1);
          return get(item, cleanRestPath);
        } else {
          const itemData = { temp: item };
          return get(itemData, `temp${restPath}`);
        }
      });
    }
  }

  // Voor ranges zoals data[0:5]
  const rangeMatch = path.match(/\[(\d+):(\d+)\]/);
  if (rangeMatch) {
    const [fullMatch, startStr, endStr] = rangeMatch;
    const start = parseInt(startStr);
    const end = parseInt(endStr);

    const basePath = path.split(fullMatch)[0];
    const restPath = path.split(fullMatch).slice(1).join('');

    // Directe array voor root-level range
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

  // Fallback naar normale get
  return get(data, path);
}
