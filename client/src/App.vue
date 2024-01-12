<script setup lang="ts">
  import { ref } from 'vue';
  import SnakeCanvas from './components/SnakeCanvas.vue';
  import LeaderBoard from './components/LeaderBoard.vue';

  const isStarted = ref<boolean>(false);
  const playerName = ref<string>('');
  const highScore = ref<HTMLElement | null>(null);
  const score = ref<HTMLElement | null>(null);

  function startGame() {
    if (!playerName.value) {
      alert('Please enter your name');
      return;
    }
    isStarted.value = true;
  }

  function exitGame() {
    isStarted.value = false;
  }

  function resetScoreUI() {
    if (score.value) score.value.textContent = '0';
    if (highScore.value) highScore.value.textContent = '0';
  }

  async function deleteAllScores() {
    const response = await fetch('http://localhost:3000/api/score', {
      method: 'DELETE',
    });

   await response.json();

    resetScoreUI()
  }

  async function handleChange() {
    if (!playerName.value) {
      resetScoreUI()
      return;
    }

    const response = await fetch(`http://localhost:3000/api/score/${playerName.value}`, {
      method: 'GET',
    });
  
    const data = await response.json();
    console.log(data);
    if (data.length > 0) {
      const playerData = data[0];
      if (score.value) score.value.textContent = (playerData.score).toString();
      if (highScore.value) highScore.value.textContent = (playerData.highScore).toString();
      return
    }
    resetScoreUI()
  }
</script>

<template>
  <main>
    <LeaderBoard />
    <h1>Snake Game</h1>

    <p class="text-left">
      score: <span ref="score" id="score">0</span>
    </p>
    <p class="text-left">High score: <span ref="highScore" id="highScore">0</span></p>

    <div v-if="isStarted">
      <SnakeCanvas :playerName="playerName" />
    </div>
    <div v-if="!isStarted" class="form">
      <input type="text" v-model="playerName" @input="handleChange">
      <button @click="startGame">
        Start Game
      </button>
    </div>
    <div v-if="isStarted" class="form">
      <button @click="exitGame">
        Exit Game
      </button>
    </div>
    <div class="form" style="margin-top: 5px;">
      <button @click="deleteAllScores">Delete all scores</button>
    </div>
  </main>
</template>

<style scoped>
  .form {
    display: flex;
    flex-direction: column;
    gap: .5rem
  }

  .text-left {
    text-align: left;
  }
</style>
