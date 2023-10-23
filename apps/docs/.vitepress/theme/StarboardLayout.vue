<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import {withBase} from "vitepress";

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #not-found>
      <div class="NotFound">
        <img class="compass" :src="withBase('/assets/compass.webp')" alt="Minecraft Compass" />
        <h1 class="title">ARE YOU LOST?</h1>

        <p class="subtitle">This page does not exist.</p>
        <div class="button">
          <a
              class="link"
              :href="withBase('/')"
              aria-label="Go Home"
          >
            Go Home
          </a>
        </div>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.NotFound {
  padding: 64px 24px 96px;
  text-align: center;
}

@media (min-width: 768px) {
  .NotFound {
    padding: 96px 32px 168px;
  }
}

.compass {
  margin: auto;
}

.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}

.subtitle {
  margin: 15px auto auto;
  max-width: 256px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.button {
  padding-top: 20px;
}

.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition:
      border-color 0.25s,
      color 0.25s;
}

.link:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-2);
}
</style>
