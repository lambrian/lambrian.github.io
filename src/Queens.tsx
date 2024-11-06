import { Link } from 'react-router-dom'
import { BOARDS, QueenBoard } from './boards'

export const Queens = () => {
    return (
        <div>
            Queens Game
            <div className="queens-list">
                {BOARDS.map((board: QueenBoard) => (
                    <Link to={`/queens/${board.date}`}>{board.date}</Link>
                ))}
            </div>
        </div>
    )
}
