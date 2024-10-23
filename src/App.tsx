import './App.css'
import { Home } from './Home'
import { Routes, Route } from 'react-router-dom'
import { Queens } from './Queens'
import { QueensBoard } from './QueensBoard'

export const App = () => {
    return (
        <Routes>
            <Route path="" element={<Home />} />
            <Route path="/queens" element={<Queens />} />
            <Route path="/queens/:date" element={<QueensBoard />} />
        </Routes>
    )
}

export default App
