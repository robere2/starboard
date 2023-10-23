// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import './style.css'
import StarboardLayout from "./StarboardLayout.vue";
import type {EnhanceAppContext} from "vitepress";

export default {
  extends: Theme,
  Layout: StarboardLayout,
  enhanceApp(ctx: EnhanceAppContext) {

  }
}
