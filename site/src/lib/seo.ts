// JSON-LD for every page. Facts (definition, pricing, profile links) come from
// facts.md so structured data can never drift from the visible text.
import { definitionText, pricing, section } from './facts';

export const SITE = 'https://memtory.com';
const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;

export interface Crumb {
  name: string;
  path: string;
}

// Every URL in the Links section except the site itself (the identity ticket
// grows this list with the GitHub org, X and LinkedIn profiles).
const sameAs = section('Links')
  .map((item) => item.match(/https?:\/\/\S+/)?.[0])
  .filter((url): url is string => !!url && !url.startsWith(SITE));

const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Memtory',
  url: SITE,
  logo: `${SITE}/og.png`,
  sameAs,
};

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'Memtory',
  url: SITE,
  description: definitionText,
  publisher: { '@id': ORG_ID },
};

// No aggregateRating: there are no real reviews to cite.
function softwareApplication() {
  return {
    '@type': 'SoftwareApplication',
    name: 'Memtory',
    url: SITE,
    description: definitionText,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    publisher: { '@id': ORG_ID },
    offers: pricing().map(({ name, detail }) => {
      const price = detail.match(/\$(\d+(?:\.\d+)?)/)?.[1] ?? '0';
      return {
        '@type': 'Offer',
        name,
        description: detail,
        price,
        priceCurrency: 'USD',
        ...(price !== '0' && {
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price,
            priceCurrency: 'USD',
            unitText: /per seat/.test(detail) ? 'seat per month' : 'month',
          },
        }),
      };
    }),
  };
}

function breadcrumbList(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: new URL(c.path, SITE).href,
    })),
  };
}

export function jsonLd(opts: { breadcrumbs?: Crumb[]; software?: boolean }) {
  const graph: object[] = [organization, website];
  if (opts.breadcrumbs?.length) graph.push(breadcrumbList(opts.breadcrumbs));
  if (opts.software) graph.push(softwareApplication());
  // Escape "<" so the JSON can never close the <script> element early.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}
