import './App.css'
import { Home } from './Home'
import { Routes, Route } from 'react-router-dom'
import { Queens } from './Queens'
import { QueensBoard } from './QueensBoard'
import { Photoset } from './PhotoSet'

export const App = () => {
    return (
        <Routes>
            <Route path="" element={<Home />} />
            <Route path="/photos/berlin" element={<Photoset />} />
            <Route path="/queens" element={<Queens />} />
            <Route path="/queens/:date" element={<QueensBoard />} />
        </Routes>
    )
}

export default App
