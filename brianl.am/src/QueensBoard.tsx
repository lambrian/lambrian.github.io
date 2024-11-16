import React from 'react'
import { useParams } from 'react-router-dom'
import './queens.css'
import { useCallback, useMemo, useState } from 'react'
import BOARDS from './board-data.json'
declare module 'react' {
    interface CSSProperties {
        '--length'?: number
    }
}

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
    isWin: boolean
}

const getCellBorder = (index: number, grid: number[]): string => {
    const sideLength = Math.sqrt(grid.length)
    let classes = []

    if (index % sideLength > 0 && grid[index - 1] !== grid[index]) {
        classes.push('border-left')
    }
    if (
        index % sideLength !== sideLength - 1 &&
        index < grid.length &&
        grid[index + 1] !== grid[index]
    ) {
        classes.push('border-right')
    }

    if (index >= sideLength && grid[index - sideLength] !== grid[index]) {
        classes.push('border-top')
    }

    if (
        index < grid.length - sideLength &&
        grid[index] !== grid[index + sideLength]
    ) {
        classes.push('border-bottom')
    }

    classes.push(`row-${Math.floor(index % Math.sqrt(grid.length))}`)
    return classes.join(' ')
}

const Cell = (props: CellProps) => {
    return (
        <div
            onClick={() => props.setDisplay(props.index, props.display + 1)}
            className={`cell color-${props.color} ${getCellBorder(props.index, props.grid)} ${props.isInvalid ? 'invalid-cell' : ''} ${props.isWin ? 'cell-win' : ''}`}
        >
            <span className="content">{getDisplayState(props.display)}</span>
        </div>
    )
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
            } else if (state === 2) {
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
    // set invalid board
    const invalidQueens = new Set()
    display.forEach(
        (state: number, index: number, display: Map<Number, number>) => {
            if (state === 2) {
                for (let row = -1; row < 2; row++) {
                    for (let col = -1; col < 2; col++) {
                        if (row === 0 && col === 0) {
                            continue
                        }
                        if (display.get(index + row * sideLength + col) === 2) {
                            invalidQueens.add(index)
                        }
                    }
                }
            }
        }
    )

    const invalidIndices = new Set()
    for (let row = 0; row < sideLength; row++) {
        for (let col = 0; col < sideLength; col++) {
            if (
                invalidRows.has(row) ||
                invalidCols.has(col) ||
                invalidColors.has(board[row * sideLength + col]) ||
                invalidQueens.has(row * sideLength + col)
            ) {
                invalidIndices.add(row * sideLength + col)
            }
        }
    }

    return invalidIndices
}

const QueensBoardInner = (props: { board: number[] }) => {
    const sideLength = Math.sqrt(props.board.length)
    const [displayState, setDisplayState] = useState(new Map())
    console.log(displayState)
    const [undoStack, setUndoStack] = useState<
        { index: number; prevValue: number }[]
    >([])
    const [invalidState, setInvalidState] = useState(new Set())
    const [showInvalidState, setShowInvalidState] = useState(false)

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

    const numberQueens = useMemo(() => {
        return Array.from(displayState.values()).filter((val) => val === 2)
            .length
    }, [displayState])

    const gameFinished = useMemo(
        () => numberQueens === sideLength && invalidState.size === 0,
        [sideLength, numberQueens, invalidState]
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
                <div className="grid" style={{ '--length': sideLength }}>
                    {props.board.map((num, i) => (
                        <Cell
                            color={num}
                            grid={props.board}
                            index={i}
                            display={displayState.get(i) ?? 0}
                            setDisplay={setDisplayStateImpl}
                            isInvalid={showInvalidState && invalidState.has(i)}
                            isWin={gameFinished}
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
                <input
                    type="checkbox"
                    {...{ checked: showInvalidState }}
                    onClick={() => setShowInvalidState(!showInvalidState)}
                ></input>
                Show Invalid Placement
            </div>
        </>
    )
}
