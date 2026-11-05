import type { FeatureIcon, FeatureIconsResponse } from '@/src/types/featureIcon';

const ICONS_URL = 'https://admin.tareqalqeyada.sa/api/icons';
const CACHE_DURATION = 5 * 60 * 1000;

export class IconsService {
  private static request: Promise<FeatureIcon[]> | null = null;
  private static expiresAt = 0;

  static getIcons(): Promise<FeatureIcon[]> {
    if (this.request && Date.now() < this.expiresAt) return this.request;

    this.expiresAt = Date.now() + CACHE_DURATION;
    this.request = this.fetchIcons().catch((error: unknown) => {
      this.request = null;
      this.expiresAt = 0;
      throw error;
    });
    return this.request;
  }

  private static async fetchIcons(): Promise<FeatureIcon[]> {
    const response = await fetch(ICONS_URL, {
      headers: { Accept: 'application/json', 'accept-language': 'ar' },
    });
    if (!response.ok) throw new Error(`Icons API error: ${response.status}`);

    const data: FeatureIconsResponse = await response.json();
    if (!data.result || !Array.isArray(data.data?.icons)) {
      throw new Error(data.message || 'تعذر تحميل المميزات');
    }

    return data.data.icons.map((icon) => ({
      id: icon.id,
      title: icon.title,
      image: icon.image || icon.icon || '',
      top: icon.top,
    }));
  }
}
