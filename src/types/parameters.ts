export type Parameters = {
  searchUrl: string;
  additionalHeaders: string;
  useCORSProxy: boolean;
  min?: string;
  max?: string;
  path: string;
  idMap: string;
  titleMap: string;
  descriptionMap?: string;
  imageUrlMap?: string;
};
