/**
 * Genereert een string-representatie van een object/array structuur
 * Voor debugging doeleinden
 * @param structure Object of array om weer te geven
 * @param indent Indentatie-niveau (voor recursieve aanroepen)
 */
export default function generateStructurePreview(structure: Record<string, any> | any[], indent = 0): string {
  const indentStr = '  '.repeat(indent);

  if (Array.isArray(structure)) {
    if (structure.length === 0) {
      return `${indentStr}[]`;
    }

    let result = `${indentStr}[\n`;
    structure.forEach((item, index) => {
      result += `${indentStr}  ${index}: ${generateStructurePreview(item, indent + 1).trim()}\n`;
    });
    result += `${indentStr}]`;
    return result;
  } else if (typeof structure === 'object' && structure !== null) {
    const keys = Object.keys(structure);

    if (keys.length === 0) {
      return `${indentStr}{}`;
    }

    let result = `${indentStr}{\n`;
    keys.forEach(key => {
      result += `${indentStr}  ${key}: ${generateStructurePreview(structure[key], indent + 1).trim()}\n`;
    });
    result += `${indentStr}}`;
    return result;
  }

  // Primitieve waarden
  return `${indentStr}${JSON.stringify(structure)}`;
}
