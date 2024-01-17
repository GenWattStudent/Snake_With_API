<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import useSnakeData, { ISnakeDataProps, ISnakeDataReturn } from '../hooks/useSnakeData';
    import useDrawSnake, { IDrawSnakeReturn } from '../hooks/useDrawSnake';
    import useSnakeMovement, { Direction, ISnakeMovementReturn } from '../hooks/useSnakeMovement';
    import { useScoreStore } from '../store/ScoreStore';

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
    const scoreStore = useScoreStore();

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
        await scoreStore.updateScore(snakeData.snake.value.length - snakeData.snakeSize.value, props.playerName);

        if (snakeData.snake.value.length >= snakeData.board.value.length * snakeData.board.value[0].length || snakeMovement.isLose.value) {
            clearInterval(snakeInterval);
            await scoreStore.updateScore(0, props.playerName);
            alert('Game Over');
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
