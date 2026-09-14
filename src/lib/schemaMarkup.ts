import type { BlogPost, FAQ, Service } from '../types';

const baseUrl = 'https://www.act-rh.com';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService', 'LocalBusiness'],
  name: 'ACT&RH',
  alternateName: 'ACT et RH',
  description: "ACT&RH est une activité indépendante de conseil RH et d'accompagnement individuel fondée par Caroline Tillou Maratuech, docteure en gestion des ressources humaines, qui intervient auprès des organisations et des personnes confrontées à des situations d'évolution, de changement, de transition ou de questionnement.",
  founder: 'Caroline Tillou Maratuech',
  foundingDate: '2020',
  url: baseUrl,
  logo: `${baseUrl}/images/act-rh-icon.webp`,
  email: 'contact.actrh@gmail.com',
  telephone: '+33687022508',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '10bis rue de Garin',
    postalCode: '31500',
    addressLocality: 'Toulouse',
    addressRegion: 'Occitanie',
    addressCountry: 'FR'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '43.5960',
    longitude: '1.4830'
  },
  areaServed: [
    { '@type': 'City', name: 'Toulouse' },
    { '@type': 'AdministrativeArea', name: 'Haute-Garonne' },
    { '@type': 'AdministrativeArea', name: 'Occitanie' },
    { '@type': 'Country', name: 'France' }
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    }
  ],
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  knowsAbout: [
    'Conseil RH',
    'Gestion des ressources humaines',
    'Coaching professionnel',
    'Accompagnement du changement',
    'Bilan de compétences',
    'Management',
    'Leadership',
    'Transitions professionnelles',
    'Développement des compétences',
    'Co-développement professionnel',
    'Formations managériales',
    'Intelligence collective',
    'Engagement des équipes',
    'Reconversion professionnelle'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Accompagnements ACT&RH',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Conseil RH pour TPE, PME et organisations',
          url: `${baseUrl}/services/conseil-rh-entreprises`
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Accompagnement du changement',
          url: `${baseUrl}/services/accompagnement-changement`
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Accompagnement individuel',
          url: `${baseUrl}/services/accompagnement-individuel`
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Bilan de compétences',
          url: `${baseUrl}/services/bilan-de-competences`
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Formations, ateliers et co-développement',
          url: `${baseUrl}/services/formations-ateliers-codeveloppement`
        }
      }
    ]
  },
  sameAs: [
    'https://www.linkedin.com/in/caroline-tillou-maratuech-2b30372a/'
  ]
};

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Caroline Tillou Maratuech',
  description: "Docteure en gestion des ressources humaines, enseignante-chercheuse à TBS Education, consultante RH et professionnelle de l'accompagnement individuel. Fondatrice d'ACT&RH.",
  jobTitle: "Docteure en gestion des ressources humaines, enseignante-chercheuse, consultante RH et professionnelle de l'accompagnement individuel",
  honorificSuffix: 'Docteure en GRH',
  worksFor: { '@type': 'Organization', name: 'ACT&RH', url: baseUrl },
  alumniOf: 'Doctorat en Gestion des Ressources Humaines',
  hasCredential: 'Coach Consultant RNCP 7',
  knowsAbout: [
    'Conseil RH',
    'Accompagnement du changement',
    'Accompagnement individuel',
    'Coaching professionnel',
    'Bilan de compétences',
    'Management',
    'Gestion des ressources humaines',
    'Co-développement'
  ],
  sameAs: [
    'https://www.linkedin.com/in/caroline-tillou-maratuech-2b30372a/'
  ]
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ACT&RH',
  url: baseUrl,
  inLanguage: 'fr-FR'
};

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  };
}

export function faqSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  };
}

export function serviceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    provider: organizationSchema,
    areaServed: ['Toulouse', 'Occitanie', 'France à distance'],
    audience: {
      '@type': 'Audience',
      audienceType: service.targetAudience.join(', ')
    },
    description: service.shortDescription,
    url: `${baseUrl}/services/${service.slug}`,
    serviceType: 'Conseil RH et accompagnement individuel',
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/contact`,
      description: 'Premier échange sans engagement'
    }
  };
}

export function articleSchema(post: BlogPost) {
  const image = post.cover_image_url ?? '/images/meeting_collaboration.webp';
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: image.startsWith('http') ? image : `${baseUrl}${image}`,
    keywords: post.tags.join(', '),
    author: personSchema,
    publisher: {
      ...organizationSchema,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/act-rh-icon.webp`
      }
    },
    datePublished: post.published_at,
    dateModified: post.published_at,
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
    inLanguage: 'fr-FR',
    about: {
      '@type': 'Thing',
      name: post.category
    }
  };
}
