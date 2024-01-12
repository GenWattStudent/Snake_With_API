import { Ref, ref } from "vue"
import { SnakeObjctTypes } from "./useSnakeData"

export interface IDrawSnakeProps {
    context : CanvasRenderingContext2D
}

export interface IDrawSnakeReturn {
    ctx: Ref<CanvasRenderingContext2D>
    draw: (board: number[][], cellSize: number, tail: Ref<{ x: number, y: number }>, head: Ref<{ x: number, y: number }>) => void
}

export default function useDrawSnake({ context } : IDrawSnakeProps) : IDrawSnakeReturn {
    const ctx = ref<CanvasRenderingContext2D>(context)

    function drawSnake(x: number, y: number, size: number) {
        ctx.value.fillStyle = 'green'
        ctx.value.fillRect(x, y, size, size)
    }

    function drawHead(x: number, y: number, size: number) {
        ctx.value.fillStyle = 'yellow'
        ctx.value.fillRect(x, y, size, size)
    }

    function drawTail(x: number, y: number, size: number) {
        ctx.value.fillStyle = 'blue'
        ctx.value.fillRect(x, y, size, size)
    }

    function drawFood(x: number, y: number, size: number) {
        ctx.value.fillStyle = 'red'
        ctx.value.fillRect(x, y, size, size)
    }

    function draw(board: number[][], cellSize: number, tail: Ref<{ x: number, y: number }>, head: Ref<{ x: number, y: number }>) {
        ctx.value.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height)

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board.length; x++) {
                switch (board[y][x]) {
                    case SnakeObjctTypes.Snake:
                        drawSnake(x * cellSize, y * cellSize, cellSize)
                        break
                    case SnakeObjctTypes.Food:
                        drawFood(x * cellSize, y * cellSize, cellSize)
                        break
                    default:
                        // ctx.value.fillStyle = 'white'
                        break
                }
            }
        }

        drawHead(head.value.x * cellSize, head.value.y * cellSize, cellSize)
        drawTail(tail.value.x * cellSize, tail.value.y * cellSize, cellSize)
    }

    return { ctx, draw }
}