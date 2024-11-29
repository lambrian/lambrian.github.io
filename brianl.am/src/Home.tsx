import React from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
    return (
        <div className="content-wrapper">
            <div className="intro">
                Hey there, I'm Brian <div className="handwave">👋</div>
            </div>
            <div className="intro-description">
                <p>
                    I'm an engineering manager at Figma working on design
                    systems and more broadly how designs are shared and reused.
                </p>
                <p>
                    I was previously an engineer here at Figma and at Instagram,
                    and Facebook Messenger. Before that, I studied Computer
                    Science at Stanford.
                </p>
                <p>
                    I like taking photos which I sometimes share on my{' '}
                    <a href="https://instagram.com/_brianlam">Instagram</a>. I
                    most recently traveled to{' '}
                    <Link to="/photos/berlin">Berlin</Link>.
                </p>
            </div>
        </div>
    )
}
