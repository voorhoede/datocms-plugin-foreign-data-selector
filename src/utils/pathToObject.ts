/**
 * Zet een JSONPath-stijl pad om naar een genest object
 * @param path Pad zoals "result.products" of "data[*].items"
 * @param value Waarde die op het einde van het pad moet worden geplaatst
 */
export default function pathToObject(path: string, value: any = {}): Record<string, any> {
  const result: Record<string, any> = {};
  // Split het pad op punten
  const segments = path.split('.');
  let current = result;

  segments.forEach((segment, i) => {
    // Match verschillende soorten array notaties:
    // - data[0]     -> specifiek element
    // - data[*]     -> wildcard (alle elementen)
    // - data[0:5]   -> range (elementen 0-5)
    // - data[-3:]   -> laatste 3 elementen
    const arrayMatch = segment.match(/^(\w+)(?:\[(.*?)\])+$/);

    if (arrayMatch) {
      const [, arrayName, arrayExpression] = arrayMatch;

      // Als dit het laatste segment is
      if (i === segments.length - 1) {
        // Verwerk verschillende array expressies
        if (arrayExpression === '*') {
          // Wildcard: representeer als een voorbeeldobject
          current[arrayName] = [value];
        }
        else if (arrayExpression.includes(':')) {
          // Range: maak een array met voorbeeldobjecten
          const [start, end] = arrayExpression.split(':').map(s =>
            s === '' ? null : parseInt(s)
          );

          current[arrayName] = [value];
          // Als we specifieke indicatie willen geven dat dit een range is
          current[`_${arrayName}RangeInfo`] = {
            start: start ?? 0,
            end: end ?? 'end',
            isRange: true
          };
        }
        else if (arrayExpression.startsWith('-')) {
          // Negatieve index (bijv. laatste elementen)
          current[arrayName] = [value];
          // Indicatie dat dit de laatste elementen zijn
          current[`_${arrayName}Info`] = {
            fromEnd: parseInt(arrayExpression.slice(1)),
            isNegativeIndex: true
          };
        }
        else {
          // Normale index: maak een array met het element op de juiste positie
          const index = parseInt(arrayExpression);
          current[arrayName] = [];

          // Vul de array op tot aan de index
          for (let j = 0; j <= index; j++) {
            current[arrayName][j] = j === index ? value : null;
          }
        }
      }
      else {
        // Dit is niet het laatste segment
        if (arrayExpression === '*') {
          // Voor wildcards in het midden van een pad, maak een voorbeeld array met één object
          current[arrayName] = [{}];
          current = current[arrayName][0];
        }
        else {
          // Voor specifieke indices
          const index = parseInt(arrayExpression);
          current[arrayName] = [];
          current[arrayName][index] = {};
          current = current[arrayName][index];
        }
      }
    }
    else {
      // Normale property zonder array notatie
      if (i === segments.length - 1) {
        current[segment] = value;
      } else {
        current[segment] = {};
        current = current[segment];
      }
    }
  });

  return result;
}
