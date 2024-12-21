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
                    I'm an engineering manager at Figma and previously an
                    engineer here and elsewhere. Before that, I studied Computer
                    Science at Stanford.
                </p>
                <p>
                    I like taking photos which I sometimes share on my{' '}
                    <a href="https://instagram.com/_brianlam">Instagram</a>.
                    Some places I've been are
                    <Link to="/photos/berlin"> Berlin</Link> and{' '}
                    <Link to="/photos/south-america">South America</Link>.
                </p>
            </div>
        </div>
    )
}
