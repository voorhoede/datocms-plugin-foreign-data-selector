import createPreviewObject from "./createPreviewObject";

/**
 * Een kant-en-klare functie voor het genereren van een JSON preview string
 * voor gebruik in de DatoCMS plugin
 */
export default function renderPreviewJson(
  path: string,
  idMap: string,
  titleMap: string,
  descriptionMap?: string,
  imageUrlMap?: string
): string {
  const previewObj = createPreviewObject(path, idMap, titleMap, descriptionMap, imageUrlMap);
  return JSON.stringify(previewObj, null, 2);
}
