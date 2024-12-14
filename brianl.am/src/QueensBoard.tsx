import React from 'react'
import { useParams } from 'react-router-dom'
import './queens.css'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { QueenBoard } from './Queens'

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

const getCellClasses = ({
    color,
    grid,
    index,
    display,
    isInvalid,
    isWin,
}: CellProps): string => {
    const sideLength = Math.sqrt(grid.length)
    const classes = []
    classes.push('cell')
    classes.push(`color-${color}`)
    classes.push(`row-${Math.floor(index / Math.sqrt(grid.length))}`)

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

    if (isInvalid) {
        classes.push('invalid-cell')
    }

    if (isWin) {
        classes.push('cell-win')
    }

    if (display === 1) {
        classes.push('ruled')
    } else if (display === 2) {
        classes.push('queen')
    }

    return classes.join(' ')
}

const Cell = (props: CellProps) => {
    return (
        <div
            onClick={() => props.setDisplay(props.index, props.display + 1)}
            className={getCellClasses(props)}
        >
            <span className="content">{getDisplayState(props.display)}</span>
        </div>
    )
}

const findSolution = (board: number[]): Map<number, number> => {
    const missingQueens: Array<number> = []
    for (let i: number = 0; i < Math.sqrt(board.length); i++) {
        missingQueens.push(i)
    }

    const colorPositions: Map<number, Array<number>> = new Map()
    missingQueens.forEach((color) => {
        const currColorPositions = []
        for (let i = 0; i < board.length; i++) {
            if (board[i] === color) {
                currColorPositions.push(i)
            }
        }
        colorPositions.set(color, currColorPositions)
    })

    const currentPlacements: Map<number, number> = new Map([])

    const result = findSolutionInner(
        board,
        colorPositions,
        missingQueens,
        currentPlacements
    )

    if (result.result) {
        return result.solution
    }

    console.log('Did not find solution')
    return new Map()
}

// optimizations to consider later
// saving set of queen placements that return false
// color => Set<coordinate> pre-calc
// given the game board and an existing set of queen placements,
// arbitrarily pick a color missing a queen
// for all of the squares within that color
//      pick it as a queen
//      run validation
//      if no existing invalidations, descend with current placement
//      if there are invalid cells, continue
// if no valid placements are possible given the existing placement, return False
const findSolutionInner = (
    board: number[],
    colorPositions: Map<number, Array<number>>,
    missingQueenColors: Array<number>,
    currentPlacements: Map<number, number>
): { result: true; solution: Map<number, number> } | { result: false } => {
    if (!missingQueenColors.length) {
        return { result: true, solution: currentPlacements }
    }

    const nextQueen = missingQueenColors.pop()
    if (nextQueen === undefined) {
        return { result: true, solution: currentPlacements }
    }

    const nextQueenPositions = colorPositions.get(nextQueen)
    if (!nextQueenPositions) {
        // should not happen
        return { result: false }
    }

    const positionsToConsider = nextQueenPositions
    for (let i = 0; i < positionsToConsider.length; i++) {
        const position = positionsToConsider[i]
        currentPlacements.set(position, 2)
        const invalids: Set<number> = validateDisplayState(
            board,
            currentPlacements
        )
        if (!invalids.size) {
            const result = findSolutionInner(
                board,
                colorPositions,
                missingQueenColors,
                currentPlacements
            )
            if (result.result) {
                return { result: true, solution: currentPlacements }
            }
        }
        currentPlacements.delete(position)
    }

    missingQueenColors.push(nextQueen)
    return { result: false }
}

export const QueensBoard = () => {
    const { date } = useParams()
    const [data, setData] = useState<Array<QueenBoard>>([])
    useEffect(() => {
        fetch('/board-data.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Not Found')
                }

                return response.json()
            })
            .then((json) => setData(json))
            .catch((err) => console.error(err))
    }, [])
    const matchingBoard = useMemo(() => {
        if (!date) {
            return null
        }
        return data.find((board) => board.date === date)
    }, [date, data])

    if (!matchingBoard) {
        return <div>Not Found</div>
    }

    return <QueensBoardInner board={matchingBoard.grid} />
}

const validateDisplayState = (
    board: number[],
    display: Map<number, number>
): Set<number> => {
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
                /*
                // check previous row
                if (display.get(index - sideLength) === 2) queenIsInvalid = true
                // check next row
                if (display.get(index + sideLength) === 2) queenIsInvalid = true
                // check prev col
                if (index % sideLength > 0 && display.get(index - 1) === 2) {
                    queenIsInvalid = true
                }
                // check next col
                if (index % sideLength < sideLength - 1) {
                    queenIsInvalid = true
                }
                */
                for (let row = -1; row < 2; row++) {
                    for (let col = -1; col < 2; col++) {
                        if (row === 0 && col === 0) {
                            continue
                        }

                        if (col === -1 && index % sideLength === 0) {
                            continue
                        }

                        if (
                            col === 1 &&
                            index % sideLength === sideLength - 1
                        ) {
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

    const invalidIndices: Set<number> = new Set()
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

    const solve = useCallback(() => {
        clear()
        setDisplayState(findSolution(props.board))
    }, [clear, props.board])

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
                <div className="nav-button" onClick={solve}>
                    Solve
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
