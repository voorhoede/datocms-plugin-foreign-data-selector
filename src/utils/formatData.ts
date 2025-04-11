import type { Parameters } from "../types/parameters";

export default function formatData(data: any[], parameters: Parameters) {
  return data.map((item: any) => {
    const formattedItem = {
      id: item[parameters.idMap],
      title: item[parameters.titleMap],
    };
    if (parameters.descriptionMap) {
      Object.assign(formattedItem, {
        description: item[parameters.descriptionMap],
      });
    }
    if (parameters.imageUrlMap) {
      Object.assign(formattedItem, {
        imageUrl: item[parameters.imageUrlMap],
      });
    }
    return formattedItem;
  });
}
