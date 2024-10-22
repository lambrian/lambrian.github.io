import { useParams } from 'react-router-dom'
import { BOARDS, QueenBoard } from './boards'
import './queens.css'
import { useState } from 'react'

const getDisplayState = (displayState: number) => {
    const currDisplay = displayState % 3
    switch (currDisplay) {
        case 1:
            return <>x</>
        case 2:
            return <>{String.fromCodePoint(Number('128081'))}</>
        default:
            return <></>
    }
}
const Cell = ({ color }: any) => {
    const [display, setDisplay] = useState(0)
    return (
        <div
            onClick={() => setDisplay(display + 1)}
            className={`cell color-${color}`}
        >
            {getDisplayState(display)}
        </div>
    )
}

declare module 'react' {
    interface CSSProperties {
        '--rows'?: number
        '--cols'?: number
    }
}

export const QueensBoard = () => {
    const { date } = useParams()
    if (!date) {
        return <div>Not Found</div>
    }

    const matchingBoard = BOARDS.find((board) => board.date === date)
    if (!matchingBoard) {
        return <div>Not Found</div>
    }
    const sideLength = Math.sqrt(matchingBoard.grid.length)

    return (
        <div className={'grid-container'}>
            <div
                className="grid"
                style={{ '--rows': sideLength, '--cols': sideLength }}
            >
                {matchingBoard.grid.map((num) => (
                    <Cell color={num}></Cell>
                ))}
            </div>
        </div>
    )
}
