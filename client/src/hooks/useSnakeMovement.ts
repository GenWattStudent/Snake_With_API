
import { Ref, ref } from "vue";
import { SnakeObjctTypes } from "./useSnakeData";

export enum Direction {
    Up,
    Down,
    Left,
    Right
}

export interface ISnakeMovementProps {
    board: Ref<number[][]>
    prevBoard: Ref<number[][]>
    snake: Ref<{ x: number, y: number }[]>
    head: Ref<{ x: number, y: number }>
    tail: Ref<{ x: number, y: number }>
}

export interface ISnakeMovementReturn {
    direction: Ref<Direction>
    isLose: Ref<boolean>
    changeDirection: (newDirection: Direction) => void
    move: () => void
}

export default function useSnakeMovement({ board, prevBoard, snake, head, tail }: ISnakeMovementProps) : ISnakeMovementReturn {
    const direction = ref<Direction>(Direction.Up)
    const isLose = ref(false)

    function isGameOver(head: { x: number, y: number }): boolean {
        if (head.x < 0 || head.x >= board.value.length || head.y < 0 || head.y >= board.value.length) {
            console.log('Game Over')
            isLose.value = true
            return true
        }

        if (prevBoard.value[head.y][head.x] === SnakeObjctTypes.Snake) {
            console.log('Game Over')
            isLose.value = true
            return true
        }

        isLose.value = false
        return false
    }

    function updateBoard() {
        for (let i = 0; i < snake.value.length; i++) {
            board.value[snake.value[i].y][snake.value[i].x] = 1
        }
    }

    function changeDirection(newDirection: Direction) {
        direction.value = newDirection
    }

    function moveSnakeSegments() {
        for (let i = snake.value.length - 1; i > 0; i--) {
            snake.value[i] = snake.value[i - 1];
        }
    }

    function moveSnakeUp() {
        var newHead = { x: head.value.x, y: head.value.y - 1 }
        if (isGameOver(newHead)) return
        moveSnakeSegments()

        snake.value[0] = newHead
        head.value = newHead
        tail.value = snake.value[snake.value.length - 1]
        updateBoard()
    }

    function moveSnakeDown() {
        var newHead = { x: head.value.x, y: head.value.y + 1 }
        if (isGameOver(newHead)) return
        moveSnakeSegments()

        snake.value[0] = newHead
        head.value = newHead
        tail.value = snake.value[snake.value.length - 1]
        updateBoard()
    }

    function moveSnakeLeft() {
        var newHead = { x: head.value.x - 1, y: head.value.y }
        if (isGameOver(newHead)) return
        moveSnakeSegments()

        snake.value[0] = newHead
        head.value = newHead
        tail.value = snake.value[snake.value.length - 1]
        updateBoard()
    }

    function moveSnakeRight() {
        var newHead = { x: head.value.x + 1, y: head.value.y }
        if (isGameOver(newHead)) return
        moveSnakeSegments()

        snake.value[0] = newHead
        head.value = newHead
        tail.value = snake.value[snake.value.length - 1]
        updateBoard()
    }

    function move() {
        switch (direction.value) {
            case Direction.Up:
                moveSnakeUp()
                break
            case Direction.Down:
                moveSnakeDown()
                break
            case Direction.Left:
                moveSnakeLeft()
                break
            case Direction.Right:
                moveSnakeRight()
                break
            default:
                break
        }
    }

    return { direction, isLose, changeDirection, move }
}