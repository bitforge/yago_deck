<template>
    <div class="webxr">
        <canvas ref="glcanvas" class="glcanvas"></canvas>

        <div class="launcher">
            <button slot="ar-button" id="ar-button" @click="activateXR">
                <img src="~@/assets/img/ar_icon.svg" />
                Launch Genie WebXR Demo
            </button>
        </div>

        <div class="domOverlay" ref="domOverlay" v-show="xrSessionActive">
            <div class="toolbar">
                <button @click="removeLastModel">
                    <img src="~@/assets/img/undo.svg" />
                    <span>Undo</span>
                </button>
                <button @click="removeAllModels">
                    <img src="~@/assets/img/delete.svg" />
                    <span>Clear</span>
                </button>
            </div>
            <div class="touch" ref="touch" @click="placeModel">
                <p>Tap anywhere to place!</p>
            </div>
            <div class="slider" ref="slider">
                <div class="slides">
                    <div v-for="(model, index) in models" :key="index" class="slide">
                        <button
                            v-if="model.id == selectedModelId"
                            class="slide selected"
                            :style="{ backgroundImage: 'url(' + model.image + ')' }"></button>
                        <button
                            v-else
                            class="slide"
                            :style="{ backgroundImage: 'url(' + model.image + ')' }"
                            @click="updateSelectedModelId(model.id)"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./script.ts"></script>

<style scoped>
@import './style.css';
</style>
