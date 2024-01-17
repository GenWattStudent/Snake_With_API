<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { IPlayerData } from '../types';

    const playerData = ref<IPlayerData[]>([])
    let interval;

    async function getPlayerData() {
        const response = await fetch('http://localhost:3000/api/score', {
            method: 'GET',
        });

        const data = await response.json();
        playerData.value = data;
    }

    function getDataInterval() {
        getPlayerData();
    }

    onMounted(() => {
        interval = setInterval(getDataInterval, 1000);
    });

    onUnmounted(() => {
        clearInterval(interval);
    });
</script>

<template>
    <div>
        <h2>Leaderboard</h2>
        <ul>
            <li v-for="(player, index) in playerData" :key="player._id" :class="['item', index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '']">
                <span>{{ player.playerName }}</span>
                <span>{{ player.highScore }}</span>
            </li>
        </ul>
    </div>
</template>

<style>
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        background-color: rgb(109, 109, 109);
        border-radius: 5px;
        height: 210px;
        overflow: auto;
    }

    .item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        height: 20px;
        border-bottom: 2px solid white;
    }

    .item:last-child {
        border-bottom: none;
    }

    .gold {
        background-color: rgb(142, 123, 13);
    }

    .silver {
        background-color: silver;
    }

    .bronze {
        background-color: rgb(205, 127, 50);
    }
</style>