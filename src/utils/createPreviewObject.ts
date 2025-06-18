import processJsonPath from './processJsonPath';

/**
 * Creates a preview object with proper array structure
 */
export default function createPreviewObject(
  path: string,
  idMap: string,
  titleMap: string,
  descriptionMap?: string,
  imageUrlMap?: string
): Record<string, any> {
  // Create sample object
  const valueObj: Record<string, any> = {
    [idMap]: "SKU123",
    [titleMap]: "My product"
  };

  if (descriptionMap) valueObj[descriptionMap] = "My description";
  if (imageUrlMap) valueObj[imageUrlMap] = "https://assets.example.com/image.png";

  // Special case for root level array paths
  if (path === '[*]') {
    return [valueObj]; // Return direct array instead of object
  }

  return processJsonPath(path, valueObj);
}
