<script setup lang="ts">
import {VPButton, VPImage} from "vitepress/theme";
import {computed, ref} from "vue";
function isQuestion(input: unknown): input is Question {
  return input &&
      typeof input['question'] === "string" &&
      Array.isArray(input['options'])
}
function isModule(input: unknown): input is Module {
  return input && input['name'] && input['description'] && input['path']
}

function go(input: Question | Module) {
  if(isQuestion(input)) {
    currentQuestion.value = input
  } else if(isModule(input)) {
    pickedModule.value = input;
  } else {
    throw new Error("Unknown type: " + input);
  }
}

type Module = {
  name: string,
  description: string,
  path: string,
  comingSoon?: boolean
}

type Question = {
  question: string,
  options: {
    answer: string,
    next: Question | Module
  }[]
}

const modules: {cli: Module, api: Module, framework: Module} = {
  cli:{
    name: 'CLI',
    path: '/cli/',
    comingSoon: true,
    description: "The Starboard command line interface (CLI) allows you to configure and start a web server without " +
      "writing a single line of code. This is a great option for those new to software development or web " +
      "development. This may also be a good fit for you if you do not need complex backend logic or are working on a " +
        "proof of concept."
  },
  framework:{
    name: 'Framework',
    path: '/framework/',
    comingSoon: true,
    description: "The Starboard framework allows you to design your own web server's interface without having to " +
      "worry about the nasty details. Starboard will set up the web server, handle authentication, serve an " +
      "admin dashboard, and more, letting you work on the fun stuff."
  },
  api:{
    name: 'API',
    path: '/api/',
    description: "The Starboard API provides type-safe interfaces for interacting with the Hypixel and Mojang APIs. " +
      "This is a good solution if you already have a web backend which you want to integrate with, if you're not " +
      "making a web server, or if the framework and CLI don't meet your requirements."
  }
}

const decisionTree: Question = {
  question: "Do you already have a web backend?",
  options: [
    {
      answer: "Yes",
      next: modules.api
    },
    {
      answer: "No",
      next: {
        question: "Do you need a custom web interface?",
        options: [
          {
            answer: "Yes",
            next: modules.framework
          }, {
            answer: "No",
            next: modules.cli
          }
        ]
      }
    }
  ]
}

const currentQuestion = ref<Question>(decisionTree);
const pickedModule = ref<Module | null>(null);

const otherModules = computed<Module[]>(() => {
  return Object.values(modules).filter(m => m.name !== pickedModule.value?.name)
})
</script>

<template>
  <div class="picker-wrapper">
    <div class="jerry">
      <VPImage
        image="/assets/jerry.png"
        alt="Jerry"
      />
    </div>
    <div class="picker-content">
      <div v-if="pickedModule === null">
        <p class="question">
          {{ currentQuestion.question }}
        </p>
        <VPButton
          v-for="option of currentQuestion.options"
          :key="option.answer"
          class="option"
          :text="option.answer"
          theme="alt"
          size="big"
          @click="go(option.next)"
        />
      </div>
      <div v-else>
        <p class="picked-module-header">
          I think the <a
            class="module-name"
            :href="pickedModule.path"
          >{{ pickedModule.name }}</a>
          is right for you.
        </p>
        <Badge
          v-if="pickedModule.comingSoon"
          class="coming-soon-badge"
          type="warning"
          text="Coming Soon"
        />
        <p>{{ pickedModule.description }}</p>
        <VPButton
          text="Get Started"
          :href="pickedModule.path"
        />
        <hr>
        <p class="picked-module-header">
          However, you could also try...
        </p>
        <div
          v-for="module of otherModules"
          :key="module.name"
        >
          <a
            class="module-name"
            :href="module.path"
          >{{ module.name }}</a>
          <Badge
            v-if="module.comingSoon"
            class="coming-soon-badge"
            type="warning"
            text="Coming Soon"
          />
          <p>{{ module.description }}</p>
        </div>
        <hr>
        <VPButton
          text="Start Over"
          @click="pickedModule = null; currentQuestion = decisionTree"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.picker-wrapper {
  display: flex;
}
.question {
  font-size: 1.2em
}
.option {
  margin: 0 0.5em;
}
.picked-module-header {
  font-weight: bold;
  font-size: 1.3em;
}
.module-name {
  font-weight: bold;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.picker-content {
  max-width: 75%
}
.jerry {
  align-self: start;
}
.coming-soon-badge {
  margin-left: 0.5em;
}
</style>
