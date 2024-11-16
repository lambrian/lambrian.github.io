import { Link, useSearchParams } from 'react-router-dom'
import { BOARDS, QueenBoard } from './boards'
import BOARDS_NOTION from './board-data.json'

const QUEEN_EMOJI = String.fromCodePoint(Number('128081'))
export const Queens = () => {
    const [searchParams] = useSearchParams()
    let data = BOARDS
    if (searchParams.get('useNotion')) {
        data = BOARDS_NOTION
    }
    return (
        <div className="game-container">
            <div className="game-title">
                <span className="decoration">{QUEEN_EMOJI}</span>
                Queens
                <span className="decoration">{QUEEN_EMOJI}</span>
            </div>
            <div className="queens-list">
                {data.map((board: QueenBoard) => (
                    <div className="game-option">
                        <Link to={`/queens/${board.date}`}>{board.date}</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
