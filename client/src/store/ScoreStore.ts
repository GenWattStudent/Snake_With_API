import { defineStore } from "pinia"

interface ScoreState {
    score: number
    playerName: string
    highScore: number
}

export const useScoreStore = defineStore({
    id: "score",
    state: () : ScoreState => ({
        score: 0,
        playerName: "",
        highScore: 0,
    }),
    getters: {
        getScore() : number {
            return this.score
        },
        getPlayerName(): string {
            return this.playerName
        },
        getHighScore(): number {
            return this.highScore
        },
    },
    actions: {
        setScore(score: number) {
            this.score = score
        },
        setPlayerName(playerName: string) {
            this.playerName = playerName
        },
        setHighScore(highScore: number) {
            this.highScore = highScore
        },
        reset() {
            this.score = 0
            this.highScore = 0
        },
        async getPlayerData(playerName: string) {
            try {
                const response = await fetch(`http://localhost:3000/api/score/${playerName}`, {
                    method: 'GET',
                });
                
                const data = await response.json();
            
                if (data.length > 0) {
                    const playerData = data[0];
                    this.setScore(playerData.score);
                    this.setHighScore(playerData.highScore);
                    return;
                }
                this.reset();
            } catch (error) {
                this.reset()
            }
        },
        async updateScore(score: number, playerName: string) {
            try {
                const response = await fetch('http://localhost:3000/api/score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ score, playerName })
                });

                const data = await response.json();
        
                this.setScore(data.score);
                this.setHighScore(data.highScore);
            } catch (error) {
                console.log(error);
            }
        }
    },
})