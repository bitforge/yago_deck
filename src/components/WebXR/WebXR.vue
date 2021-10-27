<template>
  <div class="webxr">
    <canvas ref="glcanvas" class="glcanvas"></canvas>
    <button slot="ar-button" id="ar-button" @click="activateXR()">
      Start WebXR
    </button>
    <div claas="domOverlay" ref="domOverlay">
      <div class="removeButtons">
        <button class="removeAllButton" @click="removeAllModels()">
          Remove all objects
        </button>
        <button class="removeLastButton" @click="removeLastModel()">
          Remove last objects
        </button>
      </div>
      <div class="touch" ref="touch" @click="placeModel()">
        <p>Tap anywhere to place!</p>
      </div>
      <div class="slider" ref="slider">
        <div class="slides">
          <div v-for="(model, index) in models" :key="index" class="slide">
            <button
              v-if="model.id == selectedModelId"
              class="slide selected"
              :style="{ backgroundImage: 'url(' + model.image + ')' }"
            ></button>
            <button
              v-else
              class="slide"
              :style="{ backgroundImage: 'url(' + model.image + ')' }"
              @click="updateSelectedModelId(model.id)"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.ts"></script>

<style scoped>
@import "./style.css";
</style>
