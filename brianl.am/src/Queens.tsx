import { Link } from 'react-router-dom'
import BOARDS from './board-data.json'
import { DateTime } from 'luxon'

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
    const weeksinMonth = Math.ceil((firstDayOfMonth.weekday + daysInMonth) / 7)
    console.log(firstDayOfMonth.toString(), weeksinMonth)

    // Get the first day of the current month
    console.log(
        'days, first day, weeks in month',
        daysInMonth,
        firstDayOfMonth.weekday,
        weeksinMonth
    )

    const datesToRender = []
    for (let i = 1; i < firstDayOfMonth.weekday; i++) {
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
            <div className={`calendar-view weeks-${weeksinMonth}`}>
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

const QUEEN_EMOJI = String.fromCodePoint(Number('128081'))
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
    console.log('months', months)
    return (
        <div className="game-container">
            <div className="game-title">
                <span className="decoration">{QUEEN_EMOJI}</span>
                Queens
                <span className="decoration">{QUEEN_EMOJI}</span>
            </div>
            <div className="queens-list">
                {Array.from(months.entries()).map((curr) => (
                    <Calendar month={curr[0]} dates={curr[1]} />
                ))}
            </div>
        </div>
    )
}
