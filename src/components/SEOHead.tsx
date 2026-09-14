import { useEffect } from 'react';

const DEFAULT_TITLE = 'ACT&RH | Conseil RH & accompagnement individuel — Caroline Tillou Maratuech';
const DEFAULT_DESCRIPTION = "Comprendre ce qui se joue, clarifier les choix, construire la suite. Conseil RH et accompagnement individuel à Toulouse, en Occitanie, en France et à distance.";
const DEFAULT_IMAGE = '/images/equinoxe-social-card.png';

type SEOHeadProps = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: object | object[];
};

export function SEOHead({ title, description, canonical, image, type = 'website', schema }: SEOHeadProps) {
  useEffect(() => {
    const pageTitle = title || DEFAULT_TITLE;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const pageUrl = canonical ?? window.location.href;
    const pageImage = image ?? DEFAULT_IMAGE;
    const absoluteImage = pageImage.startsWith('http') ? pageImage : `${window.location.origin}${pageImage}`;

    document.title = pageTitle;
    upsertMeta('name', 'description', pageDescription);
    upsertMeta('name', 'robots', 'index, follow');
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', pageDescription);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', 'ACT&RH');
    upsertMeta('property', 'og:locale', 'fr_FR');
    upsertMeta('property', 'og:url', pageUrl);
    upsertMeta('property', 'og:image', absoluteImage);
    upsertMeta('property', 'og:image:secure_url', absoluteImage);
    upsertMeta('property', 'og:image:alt', 'ACT&RH - conseil RH et accompagnement professionnel et personnel');
    upsertMeta('property', 'og:image:width', '1200');
    upsertMeta('property', 'og:image:height', '630');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', pageDescription);
    upsertMeta('name', 'twitter:image', absoluteImage);
    upsertMeta('name', 'twitter:image:alt', 'ACT&RH');
    upsertLink('canonical', pageUrl);

    const id = 'schema-jsonld';
    document.getElementById(id)?.remove();
    if (schema) {
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(Array.isArray(schema) ? schema : [schema]);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, image, type, schema]);

  return null;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}
