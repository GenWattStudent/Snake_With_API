import { Ref, ref } from 'vue'

export enum SnakeObjctTypes {
    Empty = 0,
    Snake = 1,
    Food = 2
}

export interface ISnakeDataProps {
    gameCanvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    size: number
    snakeInitialSize: number
    cellSizePixels?: number
}

export interface ISnakeDataReturn {
    canvas: Ref<HTMLCanvasElement>
    ctx: Ref<CanvasRenderingContext2D>
    gridSize: Ref<number>
    cellSize: Ref<number>
    board: Ref<number[][]>
    prevBoard: Ref<number[][]>
    snakeSize: Ref<number>
    tail: Ref<{ x: number, y: number }>
    food: Ref<{ x: number, y: number }>
    head: Ref<{ x: number, y: number }>
    snake: Ref<{ x: number, y: number }[]>
    isFood: Ref<boolean>
    createBoard: () => Ref<number[][]>
    addSnake: (x: number, y: number, size?: number) => void
    createFoodInRandomPosition: () => void
    clearBoard: () => void
}

export default function useSnakeData({ gameCanvas, context, size, snakeInitialSize, cellSizePixels = 10 } : ISnakeDataProps) : ISnakeDataReturn { 
    const canvas = ref<HTMLCanvasElement>(gameCanvas)
    const ctx = ref<CanvasRenderingContext2D>(context)
    const gridSize = ref(size)
    const cellSize = ref(cellSizePixels)
    const board = ref<number[][]>([[]])
    const prevBoard = ref<number[][]>([[]])
    const snakeSize = ref(snakeInitialSize)
    const tail = ref({ x: 0, y: 0 })
    const head = ref({ x: 0, y: 0 })
    const food = ref({ x: 0, y: 0 })
    const isFood = ref(false)
    const snake: Ref<{ x: number, y: number }[]> = ref([])

    function createFoodInRandomPosition() {
        if (isFood.value) {
            board.value[food.value.y][food.value.x] = SnakeObjctTypes.Food
            return
        }
        food.value.x = Math.floor(Math.random() * gridSize.value)
        food.value.y = Math.floor(Math.random() * gridSize.value)

        if (board.value[food.value.x][food.value.y] === SnakeObjctTypes.Snake) {
            createFoodInRandomPosition()
        }

        board.value[food.value.y][food.value.x] = SnakeObjctTypes.Food
        isFood.value = true
    }

    function createBoard() {
        for (let i = 0; i < gridSize.value; i++) {
            board.value[i] = []
            for (let j = 0; j < gridSize.value; j++) {
                board.value[i][j] = SnakeObjctTypes.Empty
            }
        }
        
        prevBoard.value = board.value.map((arr) => [...arr])
        return board
    }

    function clearBoard() {
        for (let i = 0; i < gridSize.value; i++) {
            for (let j = 0; j < gridSize.value; j++) {
                board.value[i][j] = SnakeObjctTypes.Empty
            }
        }
    }

    function addSnake(x: number, y: number, size: number = snakeSize.value) {
        for (let i = 0; i < size; i++) {
            if (x + i >= gridSize.value) {
                break
            }
            
            board.value[y][x + i] = SnakeObjctTypes.Snake
            snake.value.push({ x: x + i, y })
        }

        tail.value.x = snake.value[snake.value.length - 1].x
        tail.value.y = snake.value[snake.value.length - 1].y
        head.value.x = snake.value[0].x
        head.value.y = snake.value[0].y
    }
    
    return { canvas, ctx, gridSize, cellSize, board, snakeSize, tail, food, head, snake, isFood, prevBoard, createBoard, addSnake, createFoodInRandomPosition, clearBoard }
}