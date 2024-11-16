import { Link } from 'react-router-dom'
import BOARDS from './board-data.json'
import { DateTime } from 'luxon'

type QueenBoard = {
    date: string
    grid: number[]
}

const QUEEN_EMOJI = String.fromCodePoint(Number('128081'))
export const Queens = () => {
    const months = new Map()
    for (let i = 0; i < BOARDS.length; i++) {
        const curr = BOARDS[i]
        const month = DateTime.fromFormat(curr.date, 'yyyy-MM-dd').startOf(
            'month'
        )
        if (months.has(month.toString())) {
            console.log(months.get(month.toString()))
            months.get(month.toString()).push(curr)
        } else {
            months.set(month.toString(), [curr])
        }
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
                {Array.from(months.entries()).map((month) => {
                    return (
                        <>
                            {DateTime.fromISO(month[0]).toFormat('yyyy-MM-dd')}
                            {month[1].map((date: QueenBoard) => date.date)}
                        </>
                    )
                })}
                {BOARDS.map((board: QueenBoard) => (
                    <div className="game-option">
                        <Link to={`/queens/${board.date}`}>{board.date}</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
