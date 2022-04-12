<template>
    <!-- Used in launcher and fallback view -->
    <div class="branding">
        <img src="~@/assets/img/yago.svg" alt="Genie" class="yago" />
        <img src="~@/assets/img/logo_black.svg" alt="deck" class="deck" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Branding extends Vue {}
</script>

<style>
.branding {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px;
    margin: 16px 0;
}

.branding img.yago {
    width: 140px;
    margin: 8px 8px 0px 8px;
}

.branding img.deck {
    width: 140px;
    margin: 8px;
}
</style>
