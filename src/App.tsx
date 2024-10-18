import React from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
    return (
        <div className="content-wrapper">
            <div className="intro">Hey there, I'm Brian!</div>
            <div className="intro-description">
                <p>
                    I'm an engineering manager of the team at Figma thinking
                    about how design systems supercharges designers and design
                    teams.
                </p>
                <p>
                    I was previously an engineer, most recently at Figma, and
                    previously at Meta building various parts of Instagram,
                    Messenger, and Ads. Before that, I was at Stanford where I
                    studied Computer Science.
                </p>
                <p>
                    {' '}
                    I enjoy taking photos which can be found on my{' '}
                    <a href="https://instagram.com/_brianlam">Instagram</a>. I
                    most recently traveled to <a href="/blog/berlin">Berlin</a>.
                </p>
            </div>
        </div>
    )
}

export default App
