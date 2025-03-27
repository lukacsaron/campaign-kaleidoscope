export interface UTMParams {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  links: UTMLink[];
}

export interface UTMLink {
  id: string;
  campaignId: string;
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  utmUrl: string;
  createdAt: Date;
  // Note: The 'clicks' property has been removed
}

export const SOURCES = [
  'google',
  'facebook',
  'twitter',
  'linkedin',
  'instagram',
  'email',
  'newsletter',
  'blog',
  'youtube',
  'tiktok',
  'direct',
  'referral',
  'organic',
  'bing',
  'partner',
  'display',
  'other'
];

export const MEDIUMS = [
  'cpc',
  'organic',
  'social',
  'email',
  'referral',
  'display',
  'video',
  'affiliate',
  'push',
  'ppc',
  'paid-social',
  'banner',
  'native',
  'retargeting',
  'sms',
  'qr'
];

export function generateUTMUrl(params: UTMParams): string {
  const url = new URL(params.url);
  
  // Add UTM parameters
  url.searchParams.set('utm_source', params.source);
  url.searchParams.set('utm_medium', params.medium);
  url.searchParams.set('utm_campaign', params.campaign);
  
  // Add optional parameters if they exist
  if (params.term) url.searchParams.set('utm_term', params.term);
  if (params.content) url.searchParams.set('utm_content', params.content);
  
  return url.toString();
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();                   // Trim whitespace from start and end
}
