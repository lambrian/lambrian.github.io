import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from './Home'
import { QueensBoard } from './QueensBoard'
import { BOARDS, QueenBoard } from './boards'

export const Queens = () => {
    return (
        <div>
            Queens
            <div className="queens-list">
                {BOARDS.map((board: QueenBoard) => (
                    <Link to={`/queens/${board.date}`}>{board.date}</Link>
                ))}
            </div>
        </div>
    )
}