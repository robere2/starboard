// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import './style.css'
import StarboardLayout from "./StarboardLayout.vue";

export default {
  extends: Theme,
  Layout: StarboardLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
