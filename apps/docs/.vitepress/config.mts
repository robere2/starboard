import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Starboard",
  description: "Built for Minecraft Developers",
  srcDir: "src",
  markdown: {
      lineNumbers: true
  },
  head: [['link', { rel: 'icon', href: '/assets/logo/ico/logo256.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CLI', link: '/cli' },
      { text: 'Framework', link: '/framework' },
      { text: 'API', link: '/api' }
    ],
    logo: '/assets/logo/png/logo128.png',
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    search: {
      provider: 'local'
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
