import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Starboard",
  description: "Built for Minecraft Developers",
  srcDir: "src",
  head: [['link', { rel: 'icon', href: '/assets/logo/ico/logo256.ico' }]],
  rewrites: {
    ':pkg/reference/modules.md': ':pkg/reference/index.md',
    ':pkg/reference/classes/:class': ':pkg/reference/:class'
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    lastUpdated: true,
    logo: '/assets/logo/png/logo128.png',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Framework', link: '/framework/' },
      { text: 'API', link: '/api/' },
      { text: 'About', items: [
          { text: 'Releases', link: 'https://github.com/robere2/starboard/releases' },
          { text: 'Contributing', link: '/CONTRIBUTING'},
          { text: 'License', link: '/LICENSE' },
          { text: 'Code of Conduct', link: '/CODE_OF_CONDUCT'}
        ]},
      { text: 'Sponsor', link: 'https://discord.com/servers/quickplay-418938033325211649'}
    ],
    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/introduction' },
            { text: 'Roadmap', link: '/roadmap' }
          ]
        },
        {
          text: 'Modules',
          items: [
            { text: 'Command line interface', link: '/cli/' },
            { text: 'Web framework', link: '/framework/' },
            { text: 'Programming interface', link: '/api/' }
          ]
        }
      ],
      '/cli/': [
        { text: '← Back to home', link: '/introduction' },
        { text: 'Introduction', link: '/cli/'},
        { text: 'Installation', link: '/cli/installation' },
        { text: 'Usage', link: '/cli/usage' },
        { text: 'Configuration', link: '/cli/configuration' }
      ],
      '/framework/': [
        { text: '← Back to home', link: '/introduction' },
        {
          text: 'Getting Started', items: [
            { text: 'Introduction', link: '/framework/'},
            { text: 'Installation', link: '/framework/installation' },
            { text: 'Quick Start', link: '/framework/quick-start' },
            { text: 'Configuration', link: '/framework/configuration' },
          ]
        },
        {
          text: 'Essentials', items: [

          ]
        },
        {
          text: 'Recipes', items: [

          ]
        },
        { text: 'Reference', link: '/framework/reference/' }
      ],
      '/api/': [
        { text: '← Back to home', link: '/introduction' },
        {
          text: 'Getting Started', items: [
            { text: 'Introduction', link: '/api/'},
            { text: 'Installation', link: '/api/installation' },
            { text: 'Quick Start', link: '/api/quick-start' },
          ]
        },
        {
          text: 'Essentials', items: [
            { text: 'Schemas', link: '/api/schemas' },
            { text: 'Request Debouncing', link: '/api/request-debouncing' },
            { text: 'Customizing the HTTP Client', link: '/api/customizing-http-client' }
          ]
        },
        {
          text: 'Recipes', items: [

          ]
        },
        { text: 'Reference', link: '/api/reference/' }
      ]
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © ' + new Date().getFullYear()
    },
    editLink: {
      pattern: 'https://github.com/robere2/starboard/edit/master/apps/docs/src/:path',
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/robere2/starboard' },
      { icon: 'discord', link: 'https://discord.com/invite/ZuwscGD' }
    ]
  }
})
