<template>
    <div class="score-container">
        <p>Score <strong>{{ props.score }}</strong></p>
        <p>highScore <strong>{{ props.highScore }}</strong></p>
    </div>
</template>

<script lang="ts" setup>

    interface ScoreData {
        score: number;
        highScore: number;
    }

    const props = defineProps<ScoreData>()

</script>

<style>
    .score-container {
        display: flex;
        justify-content: space-between;
    }
</style>