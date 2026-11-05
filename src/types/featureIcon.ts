export interface FeatureIcon {
  id: number;
  title: string;
  image: string;
  top: boolean;
}

export interface FeatureIconsResponse {
  result: boolean;
  message?: string;
  data: {
    icons: (Omit<FeatureIcon, 'image'> & {
      image?: string | null;
      icon?: string | null;
    })[];
  };
}
