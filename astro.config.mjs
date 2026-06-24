// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.awaredb.io',
  integrations: [
    starlight({
      title: 'AwareDB',
      description:
        'AwareDB is a computational model graph — entities, relations and formulas that compute, with units, states, reversible history and what-if analysis.',
      favicon: '/favicon.svg',
      components: {
        // Full AwareDB lockup (mark + wordmark) in the header.
        SiteTitle: './src/components/SiteTitle.astro',
        // Splash hero with the lockup in place of the title, no side image.
        Hero: './src/components/Hero.astro',
      },
      // Fonts via the Google Fonts <link> (matching the Angular app and the
      // marketing site) rather than self-hosted @fontsource @font-face rules.
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Rajdhani:wght@300;400;500;600;700&display=swap',
          },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/djinalab',
        },
      ],
      sidebar: [
        {
          label: 'Introduction',
          items: [
            { label: 'What AwareDB is', slug: 'index' },
            { label: 'How it works', slug: 'concepts/how-it-works' },
            { label: 'Core concepts', slug: 'concepts/core-concepts' },
          ],
        },
        {
          // The by-outcomes lens: organized around what you want to achieve,
          // not which function does it. Each page links into the reference.
          label: 'Outcomes',
          items: [
            { label: 'Model a system', slug: 'outcomes/model' },
            { label: 'Run what-if scenarios', slug: 'outcomes/what-if' },
            { label: 'Forecast over time', slug: 'outcomes/forecast' },
            { label: 'Optimize & solve', slug: 'outcomes/optimize' },
          ],
        },
        {
          label: 'Get started',
          items: [
            { label: 'Quickstart', slug: 'start/quickstart' },
            { label: 'Modeling guide', slug: 'start/modeling' },
            { label: 'Formulas & units', slug: 'start/formulas' },
            { label: 'Data types', slug: 'start/data-types' },
          ],
        },
        {
          label: 'Examples',
          items: [
            { label: 'Overview', slug: 'examples' },
            { label: 'Electric car', slug: 'examples/electric-car' },
            { label: 'Train BOM', slug: 'examples/train-bom' },
            { label: 'Accounting firm', slug: 'examples/accounting-firm' },
            { label: 'SaaS startup', slug: 'examples/saas-startup' },
            { label: 'Portfolio allocation', slug: 'examples/portfolio' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Python SDK', slug: 'reference/python-sdk' },
            { label: 'REST API', slug: 'reference/rest-api' },
            { label: 'Analyses', slug: 'reference/analyses' },
            { label: 'Functions & constants', slug: 'reference/functions' },
            { label: 'Authentication', slug: 'reference/authentication' },
          ],
        },
      ],
    }),
  ],
});
