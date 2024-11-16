import { Link } from 'react-router-dom'
import { QueenBoard } from './boards'
import BOARDS_NOTION from './board-data.json'

const QUEEN_EMOJI = String.fromCodePoint(Number('128081'))
export const Queens = () => {
    return (
        <div className="game-container">
            <div className="game-title">
                <span className="decoration">{QUEEN_EMOJI}</span>
                Queens
                <span className="decoration">{QUEEN_EMOJI}</span>
            </div>
            <div className="queens-list">
                {BOARDS_NOTION.map((board: QueenBoard) => (
                    <div className="game-option">
                        <Link to={`/queens/${board.date}`}>{board.date}</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
