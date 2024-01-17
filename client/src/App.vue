<script setup lang="ts">
  import { ref } from 'vue';
  import SnakeCanvas from './components/SnakeCanvas.vue';
  import LeaderBoard from './components/LeaderBoard.vue';
  import Score from './components/Score.vue';
  import GameResultModal from './components/GameResultModal.vue';
  import { useScoreStore } from './store/ScoreStore';
  import useModal  from './hooks/useModal';

  const isStarted = ref<boolean>(false);
  const playerName = ref<string>('');
  const scoreStore = useScoreStore();
  const modal = useModal();

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

  async function deleteAllScores() {
    const response = await fetch('http://localhost:3000/api/score', {
      method: 'DELETE',
    });

    await response.json();

    scoreStore.reset();
  }

  async function handleChange() {
    if (!playerName.value) {
      scoreStore.reset();
      return;
    }

    await scoreStore.getPlayerData(playerName.value);
  }
</script>

<template>
  <main>
    <LeaderBoard />
    <h1>Snake Game</h1>
    <Score :score="scoreStore.score" :highScore="scoreStore.highScore" />

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
  <GameResultModal :isOpen="modal.isModalOpen.value" :close="modal.close" />
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
