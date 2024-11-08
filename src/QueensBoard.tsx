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
    grid: number[]
    index: number
    display: number
    setDisplay: (index: number, newVal: number) => void
    isInvalid: boolean
}

const getCellBorder = (index: number, grid: number[]): string => {
    const sideLength = Math.sqrt(grid.length)
    let classStr = ''

    if (index % sideLength > 0 && grid[index - 1] !== grid[index]) {
        classStr += 'border-left '
    }
    if (
        index % sideLength !== sideLength - 1 &&
        index < grid.length &&
        grid[index + 1] !== grid[index]
    ) {
        classStr += 'border-right '
    }

    if (index >= sideLength && grid[index - sideLength] !== grid[index]) {
        classStr += 'border-top '
    }

    if (
        index < grid.length - sideLength &&
        grid[index] !== grid[index + sideLength]
    ) {
        classStr += 'border-bottom'
    }
    return classStr
}

const Cell = (props: CellProps) => {
    return (
        <div
            onClick={() => props.setDisplay(props.index, props.display + 1)}
            className={`cell color-${props.color} ${getCellBorder(props.index, props.grid)}`}
        >
            <div className={`${props.isInvalid && 'invalid-cell'}`}>
                {getDisplayState(props.display)}
            </div>
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

const validateDisplayState = (
    board: number[],
    display: Map<number, number>
) => {
    // count queens per color region
    // queens = {colorIndex: [true, false]} for every display, if it's 2 and the
    // hasQueen has the color num, then every index with that colorNum is
    // invalid
    const invalidColors = new Set()
    const colorHasQueen = new Set()
    display.forEach(
        (state: number, index: number, display: Map<Number, number>) => {
            if (state === 2 && colorHasQueen.has(board[index])) {
                invalidColors.add(board[index])
            } else {
                colorHasQueen.add(board[index])
            }
        }
    )
    // count queens per row
    const sideLength = Math.sqrt(board.length)
    let invalidRows = new Set()
    // count queens per column
    for (let row = 0; row < sideLength; row++) {
        let rowHasQueen = false
        for (let col = 0; col < sideLength; col++) {
            if (rowHasQueen && display.get(row * sideLength + col) === 2) {
                invalidRows.add(row)
            } else if (display.get(row * sideLength + col) === 2) {
                rowHasQueen = true
            }
        }
    }
    console.log('invalid rows', invalidRows)

    const invalidCols = new Set()
    for (let col = 0; col < sideLength; col++) {
        let colHasQueen = false
        for (let row = 0; row < sideLength; row++) {
            if (colHasQueen && display.get(row * sideLength + col) === 2) {
                invalidCols.add(col)
            } else if (display.get(row * sideLength + col) === 2) {
                colHasQueen = true
            }
        }
    }
    console.log('invalid cols', invalidCols)
    // set invalid board
    const invalidIndices = new Set()
    for (let row = 0; row < sideLength; row++) {
        for (let col = 0; col < sideLength; col++) {
            if (
                invalidRows.has(row) ||
                invalidCols.has(col) ||
                invalidColors.has(board[row * sideLength + col])
            ) {
                invalidIndices.add(row * sideLength + col)
            }
        }
    }
    console.log('invalid indices', invalidIndices)

    // TODO add queen invalid adjacents

    return invalidIndices
}

const QueensBoardInner = (props: { board: number[] }) => {
    const sideLength = Math.sqrt(props.board.length)
    const [displayState, setDisplayState] = useState(new Map())
    const [undoStack, setUndoStack] = useState<
        { index: number; prevValue: number }[]
    >([])
    const [invalidState, setInvalidState] = useState(new Set())

    const setDisplayStateImpl = useCallback(
        (index: number, newValRaw: number) => {
            const newVal = newValRaw % 3
            setUndoStack([
                ...undoStack,
                { index, prevValue: displayState.get(index) ?? 0 },
            ])

            const result = new Map(displayState.set(index, newVal))
            setDisplayState(result)
            setInvalidState(validateDisplayState(props.board, result))
        },
        [props.board, displayState, undoStack, setUndoStack]
    )

    const undo = useCallback(() => {
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
        setInvalidState(new Set())
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
                            grid={props.board}
                            index={i}
                            display={displayState.get(i) ?? 0}
                            setDisplay={setDisplayStateImpl}
                            isInvalid={invalidState.has(i)}
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
