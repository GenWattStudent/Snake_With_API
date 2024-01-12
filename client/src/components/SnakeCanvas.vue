<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import useSnakeData, { ISnakeDataProps, ISnakeDataReturn } from '../hooks/useSnakeData';
    import useDrawSnake, { IDrawSnakeReturn } from '../hooks/useDrawSnake';
    import useSnakeMovement, { Direction, ISnakeMovementReturn } from '../hooks/useSnakeMovement';

    interface IProps {
        playerName: string;
    }

    const props = defineProps<IProps>()

    let snakeData : ISnakeDataReturn 
    let snakeDrawingTool : IDrawSnakeReturn 
    let snakeMovement : ISnakeMovementReturn
    let snakeInterval
    let keyName
    const snakeGameCanvas = ref<HTMLCanvasElement | null>(null);

    function init() {
        if (!snakeGameCanvas.value) {
            throw new Error('Canvas not found');
        }

        snakeGameCanvas.value.style.backgroundColor = '#000000';
        const context = snakeGameCanvas.value.getContext('2d');

        if (!context) {
            throw new Error('Canvas context not found');
        }

        const CELL_SIZE = 20;
        const canvasConfig: ISnakeDataProps = {
            gameCanvas: snakeGameCanvas.value, 
            context, 
            size: CELL_SIZE, 
            snakeInitialSize: 3, 
            cellSizePixels: snakeGameCanvas.value.width / CELL_SIZE
        }

        snakeData = useSnakeData(canvasConfig);
        snakeDrawingTool = useDrawSnake({ context: snakeData.ctx.value });
        snakeMovement = useSnakeMovement({ prevBoard: snakeData.prevBoard, board: snakeData.board, snake: snakeData.snake, tail: snakeData.tail, head: snakeData.head });
    }

    async function sendScore(score: number) {
        const response = await fetch('http://localhost:3000/api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score, playerName: props.playerName })
        });
        console.log(response);
        const data = await response.json();
        console.log(data);

        const scoreEl = document.querySelector('#score');
        const highScoreEl = document.querySelector('#highScore');
        if (scoreEl) scoreEl.textContent = (data.score).toString();
        if (highScoreEl) highScoreEl.textContent = (data.highScore).toString();
    }

    async function gameLoop() {
        snakeData.prevBoard.value = snakeData.board.value.map((row) => row.slice());
        snakeData.clearBoard();
        snakeData.createFoodInRandomPosition();
        handleDirection();
        snakeMovement.move();
        snakeDrawingTool.draw(snakeData.board.value, snakeData.cellSize.value, snakeData.tail, snakeData.head);

        if (snakeData.head.value.x === snakeData.food.value.x && snakeData.head.value.y === snakeData.food.value.y) {
            snakeData.addSnake(snakeData.tail.value.x, snakeData.tail.value.y, 1);
            snakeData.isFood.value = false;


        }
        await sendScore(snakeData.snake.value.length - snakeData.snakeSize.value);
        if (snakeData.snake.value.length >= snakeData.board.value.length * snakeData.board.value[0].length) {
            clearInterval(snakeInterval);
            alert('You win');
            window.location.reload();
        }

        if (snakeMovement.isLose.value) {
            clearInterval(snakeInterval);
            alert('You lose');
            window.location.reload();
        }
    }

    function handleDirection() {
        if (snakeMovement.direction.value === Direction.Up || snakeMovement.direction.value === Direction.Down) {
            if (keyName === 'ArrowLeft') {
                snakeMovement.changeDirection(Direction.Left);
            } else if (keyName === 'ArrowRight') {
                snakeMovement.changeDirection(Direction.Right);
            }
        } else if (snakeMovement.direction.value === Direction.Left || snakeMovement.direction.value === Direction.Right) {
            if (keyName === 'ArrowUp') {
                snakeMovement.changeDirection(Direction.Up);
            } else if (keyName === 'ArrowDown') {
                snakeMovement.changeDirection(Direction.Down);
            }
        } 
    }

    function movement(ev) {
        const key = ev.key;
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
            keyName = key;
        }
    }

    onMounted(() => {
        init()
        const board = snakeData.createBoard()
        const xCenter = Math.floor(board.value.length / 2)
        const yCenter = Math.floor(board.value[0].length / 2)

        snakeData.addSnake(xCenter, yCenter, snakeData.snakeSize.value)
        snakeInterval = setInterval(gameLoop, 300)
        window.addEventListener('keydown', movement)
    });

    onUnmounted(() => {
        if (snakeInterval) clearInterval(snakeInterval)
        window.removeEventListener('keydown', movement)
    })
</script>

<template>
    <div>
        <canvas ref="snakeGameCanvas" id="snake" width="400" height="400">
            Your browser does not support the HTML5 canvas tag.
        </canvas>
    </div>
</template>

<style scoped>

</style>
