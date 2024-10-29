import React from 'react'
import { useParams } from 'react-router-dom'
import { BOARDS } from './boards'
import './queens.css'
import { useCallback, useMemo, useState } from 'react'

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
interface CellProps {
    color: number
    index: number
    display: number
    setDisplay: (index: number, newVal: number) => void
}

const Cell = (props: CellProps) => {
    return (
        <div
            onClick={() => props.setDisplay(props.index, props.display + 1)}
            className={`cell color-${props.color}`}
        >
            {getDisplayState(props.display)}
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
    const matchingBoard = useMemo(() => {
        if (!date) {
            return null
        }
        return BOARDS.find((board) => board.date === date)
    }, [date])

    if (!matchingBoard) {
        return <div>Not Found</div>
    }

    return <QueensBoardInner board={matchingBoard.grid} />
}

const QueensBoardInner = (props: { board: number[] }) => {
    const sideLength = Math.sqrt(props.board.length)
    const [displayState, setDisplayState] = useState(new Map())
    const [undoStack, setUndoStack] = useState<
        { index: number; prevValue: number }[]
    >([])
    const setDisplayStateImpl = useCallback(
        (index: number, newVal: number) => {
            setUndoStack([
                ...undoStack,
                { index, prevValue: displayState.get(index) ?? 0 },
            ])
            setDisplayState(new Map(displayState.set(index, newVal)))
        },
        [displayState, undoStack, setUndoStack]
    )

    const undo = useCallback(() => {
        console.log(undoStack)
        if (!undoStack.length) {
            return
        }

        const lastAction = undoStack[undoStack.length - 1]
        setDisplayStateImpl(lastAction.index, lastAction.prevValue)
        setUndoStack(undoStack.slice(0, -1))
    }, [undoStack, setUndoStack, setDisplayStateImpl])

    const clear = useCallback(() => {
        setDisplayState(new Map())
        setUndoStack([])
    }, [setDisplayState, setUndoStack])

    return (
        <>
            <div className={'grid-container'}>
                <div
                    className="grid"
                    style={{ '--rows': sideLength, '--cols': sideLength }}
                >
                    {props.board.map((num, i) => (
                        <Cell
                            color={num}
                            index={i}
                            display={displayState.get(i) ?? 0}
                            setDisplay={setDisplayStateImpl}
                        ></Cell>
                    ))}
                </div>
            </div>
            <div className="nav-container">
                <div className="nav-button" onClick={undo}>
                    Undo
                </div>
                <div className="nav-button" onClick={clear}>
                    Clear
                </div>
            </div>
        </>
    )
}
