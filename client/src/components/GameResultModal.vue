<template>
    <div v-if="props.isOpen" class="overlay">
        <div>
            <h1>Game Over</h1>
            <button @click="props.close">Play again</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useScoreStore } from '../store/ScoreStore';

    interface Props {
        isOpen: boolean;
        close: () => void;
    }

    const props = defineProps<Props>();
    const scoreStore = useScoreStore();

</script>

<style>
    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0, 0, 0, 0.5);
        z-index: 100;
    }

</style>