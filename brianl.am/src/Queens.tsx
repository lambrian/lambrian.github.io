import { Link } from 'react-router-dom'
import BOARDS from './board-data.json'
import { DateTime } from 'luxon'
import { useState } from 'react'

type QueenBoard = {
    date: string
    grid: number[]
}

const Calendar = ({ month, dates }: { month: string; dates: QueenBoard[] }) => {
    const currMonth = DateTime.fromISO(month)
    const daysInMonth = currMonth.daysInMonth
    if (!currMonth || !daysInMonth) {
        return <></>
    }
    const firstDayOfMonth = currMonth.startOf('month')
    const weeksInMonth = Math.ceil((firstDayOfMonth.weekday + daysInMonth) / 7)

    // set Sunday to be 0 instead of 7
    const dayOfFirstDay = firstDayOfMonth.weekday % 7
    const datesToRender = []
    for (let i = 0; i < dayOfFirstDay; i++) {
        datesToRender.push({ str: '' })
    }
    const today = DateTime.local()
        .setZone('America/Los_Angeles')
        .toFormat('yyyy-MM-dd')
    for (let i = 1; i <= daysInMonth; i++) {
        const currDay = firstDayOfMonth
            .plus({ days: i - 1 })
            .toFormat('yyyy-MM-dd')
        const matchingBoard = dates.find((board) => board.date === currDay)
        const isToday = currDay === today
        datesToRender.push({ str: i, board: matchingBoard, isToday })
    }
    const days = ['S', 'M', 'T', 'W', 'Th', 'F', 'S']
    return (
        <div className="calendar-wrapper">
            <div className="calendar-title">
                {DateTime.fromISO(month).toFormat('MMMM yyyy')}
            </div>
            <div className={`calendar-view weeks-${weeksInMonth}`}>
                {days.map((day) => (
                    <div className="date weekday-title">{day}</div>
                ))}
                {datesToRender.map((date) => (
                    <div
                        className={`date ${date.board ? 'has-board' : ''} ${date.isToday ? 'today' : ''}`}
                    >
                        {date.board ? (
                            <Link to={`/queens/${date.board.date}`}>
                                {date.str}
                            </Link>
                        ) : (
                            date.str
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

const TitleCell = (props: { color: number }) => {
    const [currColor, setCurrColor] = useState(-1)
    let useColor = props.color
    if (currColor >= 0) {
        useColor = currColor
    }

    return (
        <div
            className={`title-cell cell color-${useColor}`}
            onClick={() => setCurrColor((currColor + 1) % 10)}
        ></div>
    )
}
const GameTitle = () => {
    const blocks = [
        // Q
        [
            20, 20, 20, 20, 20, 20, 1, 1, 1, 1, 20, 20, 1, 20, 20, 1, 20, 20, 1,
            20, 1, 1, 20, 20, 1, 1, 1, 1, 20, 20, 20, 20, 20, 1, 1, 20,
        ],
        // U
        [
            20, 20, 20, 20, 20, 20, 20, 2, 20, 20, 2, 20, 20, 2, 20, 20, 2, 20,
            20, 2, 20, 20, 2, 20, 20, 2, 20, 20, 2, 20, 20, 2, 2, 2, 2, 20,
        ],
        // E
        [
            20, 20, 20, 20, 20, 20, 20, 3, 3, 3, 3, 20, 20, 3, 20, 20, 20, 20,
            20, 3, 3, 3, 20, 20, 20, 3, 20, 20, 20, 20, 20, 3, 3, 3, 3, 20,
        ],
        // E
        [
            20, 20, 20, 20, 20, 20, 20, 4, 4, 4, 4, 20, 20, 4, 20, 20, 20, 20,
            20, 4, 4, 4, 20, 20, 20, 4, 20, 20, 20, 20, 20, 4, 4, 4, 4, 20,
        ],
        // N
        [
            20, 20, 20, 20, 20, 20, 5, 5, 5, 20, 5, 20, 5, 20, 5, 20, 5, 20, 5,
            20, 5, 20, 5, 20, 5, 20, 5, 20, 5, 20, 5, 20, 5, 5, 5, 20,
        ],
        // S
        [
            20, 20, 20, 20, 20, 20, 20, 6, 6, 6, 6, 20, 20, 6, 20, 20, 20, 20,
            20, 6, 6, 6, 6, 20, 20, 20, 20, 20, 6, 20, 20, 6, 6, 6, 6, 20,
        ],
    ]
    return (
        <>
            {blocks.map((colorArr, i) => (
                <>
                    <div id={`title-${i}`} className="grid-game-title">
                        {colorArr.map((i: number) => (
                            <TitleCell color={i}></TitleCell>
                        ))}
                    </div>
                </>
            ))}
        </>
    )
}
export const Queens = () => {
    const months: Map<string, QueenBoard[]> = new Map()
    for (let i = 0; i < BOARDS.length; i++) {
        const curr = BOARDS[i]
        const month = DateTime.fromFormat(curr.date, 'yyyy-MM-dd').startOf(
            'month'
        )
        const monthStr = month.toString()
        const inMonth = months.get(monthStr) || []
        inMonth.push(curr)
        months.set(month.toString(), inMonth)
    }

    return (
        <div className="game-container">
            <div className="game-title">
                <GameTitle></GameTitle>
            </div>
            <div className="queens-list">
                {Array.from(months.entries()).map((curr) => (
                    <Calendar month={curr[0]} dates={curr[1]} />
                ))}
            </div>
        </div>
    )
}
