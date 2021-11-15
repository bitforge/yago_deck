<template>
    <!-- Used in launcher and fallback view -->
    <div class="branding">
        <img src="~@/assets/img/genie_white.png" alt="Genie" class="genie" />
        <img src="~@/assets/img/logo_white.svg" alt="deck" class="deck" />
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
}

.branding img.genie {
    width: 140px;
    margin: 8px;
}

.branding img.deck {
    width: 140px;
    margin: 8px;
}
</style>
